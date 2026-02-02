#!/usr/bin/env python3
"""
Security Scanner Worker
Monitors a scripts folder and executes Kali Linux security scripts.
"""

import os
import sys
import argparse
import subprocess
import logging
import yaml
from datetime import datetime
from pathlib import Path
import time
import re
import concurrent.futures

# Configuration
DEFAULT_CONFIG = {
    'scripts_dir': 'scripts',
    'reports_dir': 'reports',
    'logs_dir': 'logs',
    'scan_interval': 3600,  # 1 hour in seconds
    'default_target': 'localhost',
    'parallelism': 2
}


def get_current_network() -> str:
    """Get the current network ID (SSID or Interface Name)."""
    # Method 1: iwgetid (Fastest, reliable for wifi)
    try:
        result = subprocess.run(
            ['iwgetid', '-r'], 
            capture_output=True, 
            text=True, 
            timeout=2
        )
        ssid = result.stdout.strip()
        if ssid:
            return ssid
    except Exception:
        pass
        
    # Method 2: nmcli connection show --active (Robust for NetworkManager)
    try:
        result = subprocess.run(
            ['nmcli', '-t', '-f', 'NAME,TYPE', 'connection', 'show', '--active'],
            capture_output=True, 
            text=True, 
            timeout=2
        )
        # Output format: Name:Type
        # Priority: WiFi > Ethernet > Others
        active_cons = []
        for line in result.stdout.splitlines():
            parts = line.split(':')
            if len(parts) >= 2:
                active_cons.append((parts[0], parts[1]))

        # Check for WiFi
        for name, type_ in active_cons:
            if type_ in ['802-11-wireless', 'wifi', 'wlan']:
                return name
        
        # Check for Wired/Ethernet (User requested custom interface names e.g. eth-data)
        for name, type_ in active_cons:
            if type_ in ['802-3-ethernet', 'ethernet', 'wired']:
                return name
        
        # Fallback: Return first active connection
        if active_cons:
            return active_cons[0][0]
            
    except Exception:
        pass

    # Method 3: nmcli dev wifi (Legacy fallback)
    try:
        result = subprocess.run(
            ['nmcli', '-t', '-f', 'ACTIVE,SSID', 'dev', 'wifi'],
            capture_output=True, 
            text=True, 
            timeout=3
        )
        for line in result.stdout.splitlines():
            if line.startswith('yes:'):
                return line.split(':', 1)[1].strip()
    except Exception:
        pass
    
    return "Unknown_Network"


def setup_logging(logs_dir: str) -> logging.Logger:
    """Setup logging to file and console."""
    # Determine environment
    current_network = get_current_network()
    
    # Update logs dir to include environment
    env_logs_dir = Path(logs_dir) / current_network
    env_logs_dir.mkdir(parents=True, exist_ok=True)
    
    log_file = env_logs_dir / f"worker_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    
    logger = logging.getLogger('security_worker')
    logger.setLevel(logging.DEBUG)
    
    # File handler
    fh = logging.FileHandler(log_file)
    fh.setLevel(logging.DEBUG)
    
    # Console handler
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    
    # Formatter
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)
    
    logger.addHandler(fh)
    logger.addHandler(ch)
    
    return logger


def load_config(config_path: str) -> dict:
    """Load configuration from YAML file."""
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            user_config = yaml.safe_load(f) or {}
            return {**DEFAULT_CONFIG, **user_config}
    return DEFAULT_CONFIG


def get_scripts(scripts_dir: str) -> list:
    """Get all executable scripts from the scripts directory."""
    scripts_path = Path(scripts_dir)
    if not scripts_path.exists():
        return []
    
    scripts = []
    for script in scripts_path.iterdir():
        if script.is_file() and script.suffix in ['.sh', '.py'] and os.access(script, os.X_OK):
            scripts.append(script)
    
    return sorted(scripts)


def discover_devices(target_network: str, logger: logging.Logger, dry_run: bool = False) -> list:
    """Discover active devices on the network using nmap."""
    logger.info(f"Discovering devices on {target_network}...")
    
    if dry_run:
        logger.info(f"[DRY-RUN] Would run: nmap -sn {target_network}")
        return ['192.168.1.10', '192.168.1.11'] # Examples
        
    try:
        # Run nmap ping scan
        # -sn: Ping Scan - disable port scan
        # -n: Never do DNS resolution (faster)
        cmd = ['nmap', '-sn', '-n', target_network]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode != 0:
            logger.error(f"Nmap discovery failed: {result.stderr}")
            return []
            
        # Parse output
        hosts = []
        for line in result.stdout.splitlines():
            match = re.search(r'Nmap scan report for (\S+)', line)
            if match:
                hosts.append(match.group(1))
                
        logger.info(f"Discovered {len(hosts)} active hosts")
        return hosts
        
    except Exception as e:
        logger.error(f"Discovery error: {e}")
        return []


def execute_script(script_path: Path, target: str, reports_dir: str, logger: logging.Logger, dry_run: bool = False) -> bool:
    """Execute a security script and capture output."""
    script_name = script_path.stem
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Determine environment
    current_network = get_current_network()
    env_reports_dir = Path(reports_dir) / current_network
    env_reports_dir.mkdir(parents=True, exist_ok=True)
    
    # Sanitize target for filename
    safe_target = target.replace('/', '_').replace(':', '_')
    report_file = env_reports_dir / f"{script_name}_{safe_target}_{timestamp}.txt"
    
    logger.info(f"{'[DRY-RUN] ' if dry_run else ''}Executing: {script_path.name} against target: {target}")
    
    if dry_run:
        logger.info(f"[DRY-RUN] Would save output to: {report_file}")
        return True
    
    try:
        # Execute the script with target as argument
        result = subprocess.run(
            [str(script_path), target],
            capture_output=True,
            text=True,
            timeout=3600  # 1 hour timeout
        )
        
        # Save output to report file
        # Save output to report file
        # Directory already created above
        # Path(reports_dir).mkdir(parents=True, exist_ok=True)
        with open(report_file, 'w') as f:
            f.write(f"Security Scan Report\n")
            f.write(f"{'=' * 50}\n")
            f.write(f"Script: {script_path.name}\n")
            f.write(f"Target: {target}\n")
            f.write(f"Timestamp: {datetime.now().isoformat()}\n")
            f.write(f"{'=' * 50}\n\n")
            f.write("STDOUT:\n")
            f.write(result.stdout)
            if result.stderr:
                f.write("\nSTDERR:\n")
                f.write(result.stderr)
            f.write(f"\n\nExit Code: {result.returncode}\n")
        
        if result.returncode == 0:
            logger.info(f"✓ Completed: {script_path.name} - Report saved to {report_file}")
        else:
            logger.warning(f"⚠ Script {script_path.name} exited with code {result.returncode}")
        
        return result.returncode == 0
        
    except subprocess.TimeoutExpired:
        logger.error(f"✗ Timeout: {script_path.name} exceeded 1 hour limit")
        return False
    except Exception as e:
        logger.error(f"✗ Error executing {script_path.name}: {str(e)}")
        return False


def run_worker(config: dict, logger: logging.Logger, target: str = None, dry_run: bool = False, continuous: bool = False, discover: bool = False, parallelism: int = 2, discovery_only: bool = False):
    """Main worker loop."""
    scripts_dir = config['scripts_dir']
    reports_dir = config['reports_dir']
    scan_interval = config['scan_interval']
    target = target or config['default_target']
    parallelism = parallelism or config.get('parallelism', 2)
    
    logger.info("=" * 60)
    logger.info("Security Scanner Worker Started")
    logger.info(f"Scripts Directory: {scripts_dir}")
    logger.info(f"Reports Directory: {reports_dir}")
    logger.info(f"Target: {target}")
    logger.info(f"Environment: {get_current_network()}")
    logger.info(f"Mode: {'Continuous' if continuous else 'Single Run'}")
    logger.info(f"Discovery: {'Enabled' if discover or discovery_only else 'Disabled'}")
    logger.info(f"Discovery Only: {'Yes' if discovery_only else 'No'}")
    logger.info(f"Parallelism: {parallelism}")
    if dry_run:
        logger.info("DRY-RUN MODE - No scripts will be executed")
    logger.info("=" * 60)
    
    while True:
        scripts = get_scripts(scripts_dir)
        
        # If discovery-only, we don't need scripts
        if not scripts and not discovery_only:
            logger.warning(f"No executable scripts found in {scripts_dir}/")
        else:
            targets = [target]
            if discover or discovery_only:
                targets = discover_devices(target, logger, dry_run)
            
            if not targets:
                logger.warning("No targets to scan.")
            else:
                logger.info(f"Starting scan on {len(targets)} targets with parallelism {parallelism}")
                
                if discovery_only:
                    # Just generate discovery reports
                    for host in targets:
                        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                        current_network = get_current_network()
                        env_reports_dir = Path(reports_dir) / current_network
                        env_reports_dir.mkdir(parents=True, exist_ok=True)
                        
                        safe_target = host.replace('/', '_').replace(':', '_')
                        report_file = env_reports_dir / f"network_discovery_{safe_target}_{timestamp}.txt"
                        
                        logger.info(f"Generatng discovery report for {host}")
                        
                        if not dry_run:
                            with open(report_file, 'w') as f:
                                f.write(f"Target: {host}\n")
                                f.write(f"Network: {current_network}\n")
                                f.write(f"Scanner: NetworkDiscovery\n")
                                f.write(f"Timestamp: {datetime.now().isoformat()}\n")
                                f.write(f"Status: Online\n")
                                f.write("=" * 50 + "\n\n")
                                f.write(f"Host {host} is active on the network.")
                    
                    logger.info("Discovery complete.")
                
                else:
                    # Full Scan
                    logger.info(f"Found {len(scripts)} script(s) to execute per target")
                    
                    # Function to process a single host
                    def scan_host(host):
                        logger.info(f"Scanning host: {host}")
                        for script in scripts:
                            execute_script(script, host, reports_dir, logger, dry_run)
                    
                    # Execute in parallel
                    try:
                        with concurrent.futures.ThreadPoolExecutor(max_workers=parallelism) as executor:
                            # Submit all hosts
                            futures = {executor.submit(scan_host, host): host for host in targets}
                            
                            # Wait for completion
                            for future in concurrent.futures.as_completed(futures):
                                host = futures[future]
                                try:
                                    future.result()
                                except Exception as e:
                                    logger.error(f"Error scanning host {host}: {e}")
                    except Exception as e:
                         logger.error(f"Parallel execution error: {e}")

        if not continuous:
            break
        
        logger.info(f"Sleeping for {scan_interval} seconds until next scan...")
        time.sleep(scan_interval)
    
    logger.info("Worker finished")


def main():
    parser = argparse.ArgumentParser(
        description='Security Scanner Worker - Executes Kali Linux security scripts',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 worker.py                          # Run all scripts once
  python3 worker.py -t 192.168.1.1           # Scan specific target
  python3 worker.py --dry-run                # Test without executing
  python3 worker.py --continuous             # Run continuously
  python3 worker.py -t 192.168.1.0/24 -c     # Continuous scan of network
        """
    )
    
    parser.add_argument('-t', '--target', help='Target to scan (IP, hostname, or URL)')
    parser.add_argument('-c', '--continuous', action='store_true', help='Run continuously')
    parser.add_argument('--discover', action='store_true', help='Discover devices on network (treat target as network range)')
    parser.add_argument('--discovery-only', action='store_true', help='Only discover devices, do not run security scripts')
    parser.add_argument('--parallel', type=int, default=2, help='Number of parallel hosts to scan')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be executed without running')
    parser.add_argument('--config', default='config.yaml', help='Path to config file')
    
    args = parser.parse_args()
    
    # Get the base directory (where the script is located)
    base_dir = Path(__file__).parent.absolute()
    os.chdir(base_dir)
    
    # Load configuration
    config = load_config(args.config)
    
    # Setup logging
    logger = setup_logging(config['logs_dir'])
    
    try:
        run_worker(config, logger, args.target, args.dry_run, args.continuous, args.discover, args.parallel, args.discovery_only)
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()

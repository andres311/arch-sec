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

# Configuration
DEFAULT_CONFIG = {
    'scripts_dir': 'scripts',
    'reports_dir': 'reports',
    'logs_dir': 'logs',
    'scan_interval': 3600,  # 1 hour in seconds
    'default_target': 'localhost'
}


def setup_logging(logs_dir: str) -> logging.Logger:
    """Setup logging to file and console."""
    Path(logs_dir).mkdir(parents=True, exist_ok=True)
    
    log_file = Path(logs_dir) / f"worker_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    
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


def execute_script(script_path: Path, target: str, reports_dir: str, logger: logging.Logger, dry_run: bool = False) -> bool:
    """Execute a security script and capture output."""
    script_name = script_path.stem
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    report_file = Path(reports_dir) / f"{script_name}_{timestamp}.txt"
    
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
        Path(reports_dir).mkdir(parents=True, exist_ok=True)
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


def run_worker(config: dict, logger: logging.Logger, target: str = None, dry_run: bool = False, continuous: bool = False):
    """Main worker loop."""
    scripts_dir = config['scripts_dir']
    reports_dir = config['reports_dir']
    scan_interval = config['scan_interval']
    target = target or config['default_target']
    
    logger.info("=" * 60)
    logger.info("Security Scanner Worker Started")
    logger.info(f"Scripts Directory: {scripts_dir}")
    logger.info(f"Reports Directory: {reports_dir}")
    logger.info(f"Target: {target}")
    logger.info(f"Mode: {'Continuous' if continuous else 'Single Run'}")
    if dry_run:
        logger.info("DRY-RUN MODE - No scripts will be executed")
    logger.info("=" * 60)
    
    while True:
        scripts = get_scripts(scripts_dir)
        
        if not scripts:
            logger.warning(f"No executable scripts found in {scripts_dir}/")
        else:
            logger.info(f"Found {len(scripts)} script(s) to execute")
            
            for script in scripts:
                execute_script(script, target, reports_dir, logger, dry_run)
        
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
        run_worker(config, logger, args.target, args.dry_run, args.continuous)
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()

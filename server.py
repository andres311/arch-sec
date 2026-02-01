#!/usr/bin/env python3
"""
Arch-Sec API Server
Provides REST API for the security dashboard to interact with the scanner.
"""

import os
import sys
import json
import subprocess
import threading
import glob
import shutil
from datetime import datetime
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import re

# Configuration
BASE_DIR = Path(__file__).parent.absolute()
SCRIPTS_DIR = BASE_DIR / 'scripts'
REPORTS_DIR = BASE_DIR / 'reports'
WWW_DIR = BASE_DIR / 'www'
DATA_DIR = WWW_DIR / 'data'

# Ensure directories exist
REPORTS_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)

# Active scans tracking
active_scans = {}


class APIHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler with API endpoints."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WWW_DIR), **kwargs)
    
    def do_GET(self):
        """Handle GET requests."""
        parsed = urlparse(self.path)
        path = parsed.path
        
        # API Routes
        if path == '/api/status':
            self.send_json({'status': 'running', 'timestamp': datetime.now().isoformat()})
        elif path == '/api/scripts':
            self.send_json(self.get_scripts())
        elif path == '/api/environments':
            self.send_json(self.get_environments())
        elif path == '/api/reports':
            params = parse_qs(parsed.query)
            env = params.get('env', [None])[0]
            self.send_json(self.get_reports(env))
        elif path == '/api/results':
            params = parse_qs(parsed.query)
            env = params.get('env', [None])[0]
            self.send_json(self.get_scan_results(env))
        elif path == '/api/scans':
            self.send_json(list(active_scans.values()))
        elif path.startswith('/api/report/'):
            report_name = path.replace('/api/report/', '')
            self.send_json(self.get_report_content(report_name))
        else:
            # Serve static files
            super().do_GET()
    
    def do_POST(self):
        """Handle POST requests."""
        parsed = urlparse(self.path)
        path = parsed.path
        
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            data = {}
        
        if path == '/api/scan':
            result = self.start_scan(data)
            self.send_json(result)
        elif path == '/api/parse':
            result = self.parse_all_reports()
            self.send_json(result)
        elif path == '/api/regenerate_json':
            try:
                # Get environment from query params if needed, or default to current logic
                # For this specific request, we want to regenerate the main file with *current* environment data
                # But the file is static. Let's assume we want to dump the current env's results.
                
                # Check if specific env requested, otherwise use current detected
                params = parse_qs(parsed.query)
                env = params.get('env', [None])[0]
                
                # Get data - this method now handles saving to the correct file
                data = self.get_scan_results(env)
                
                self.send_json({'status': 'success', 'message': 'scan_results parsed and regenerated'})
            except Exception as e:
                self.send_error(500, str(e))
    
    def send_json(self, data):
        """Send JSON response."""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())
    
    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def get_scripts(self):
        """Get list of available scripts."""
        scripts = []
        for script in SCRIPTS_DIR.glob('*.sh'):
            scripts.append({
                'name': script.stem,
                'filename': script.name,
                'path': str(script)
            })
        return sorted(scripts, key=lambda x: x['name'])
    
    def get_current_network(self):
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

    def get_environments(self):
        """Get list of environments with status."""
        current_net = self.get_current_network()
        envs = []
        
        # Get all subdirectories in reports
        existing_envs = set()
        if REPORTS_DIR.exists():
            for item in REPORTS_DIR.iterdir():
                if item.is_dir():
                    existing_envs.add(item.name)
        
        # Add current network if not exists
        all_envs = existing_envs.union({current_net})
        
        # Available networks (visible via nmcli) - Optional enhancement
        # For now, we'll stick to history + current
        
        for env_name in all_envs:
            envs.append({
                'name': env_name,
                'is_current': env_name == current_net,
                'has_records': env_name in existing_envs
            })
            
        return sorted(envs, key=lambda x: (not x['is_current'], x['name']))

    def get_reports(self, environment=None):
        """Get list of report files for a specific environment."""
        reports = []
        
        # Determine target directory
        if environment:
            target_dir = REPORTS_DIR / environment
        else:
            # If no env specified, try to find default or root
            target_dir = REPORTS_DIR
            
        if not target_dir.exists():
            return []

        # Recursively find txt files if we are at root, or just in the env folder
        # For strict env support, we should only look in the env folder
        
        search_pattern = '*.txt'
        for report in target_dir.glob(search_pattern):
            if report.is_file():
                stat = report.stat()
                reports.append({
                    'name': report.name,
                    'size': stat.st_size,
                    'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    'environment': environment or 'root'
                })
        return sorted(reports, key=lambda x: x['modified'], reverse=True)
    
    def get_report_content(self, report_name):
        """Get content of a specific report. Searches all envs."""
        # This is a bit tricky if names differ across envs, but names have timestamps so should be unique-ish
        # We'll search recursively
        found_file = None
        for path in REPORTS_DIR.rglob(report_name):
            if path.is_file():
                found_file = path
                break
        
        if found_file:
            return {
                'name': report_name,
                'content': found_file.read_text(errors='ignore')
            }
        return {'error': 'Report not found'}
    
    def get_scan_results(self, environment=None):
        """Parse reports and generate dashboard data."""
        results = {
            'riskScore': 0,
            'stats': {'critical': 0, 'high': 0, 'medium': 0, 'low': 0},
            'issues': [],
            'networkNodes': [],
            'recentScans': [],
            'lastUpdated': datetime.now().isoformat(),
            'environment': environment or 'all'
        }
        
        # Parse reports
        reports = []
        if environment:
             target_dir = REPORTS_DIR / environment
             if target_dir.exists():
                 reports = list(target_dir.glob('*.txt'))
        else:
             # Default behavior: perhaps show everything or just root?
             # Let's show everything for now if no env specified, or handle as error
             reports = list(REPORTS_DIR.rglob('*.txt'))

        hosts_found = set()
        
        for report in reports[:50]:  # Limit to 50 most recent
            try:
                content = report.read_text(errors='ignore')
                parsed = self.parse_report(report.name, content)
                
                # Add issues
                results['issues'].extend(parsed.get('issues', []))
                
                # Track hosts
                for issue in parsed.get('issues', []):
                    if 'host' in issue:
                        hosts_found.add(issue['host'])
                
                # Add to recent scans
                stat = report.stat()
                script_name = report.stem.rsplit('_', 2)[0] if '_' in report.stem else report.stem
                results['recentScans'].append({
                    'id': hash(report.name),
                    'name': script_name.replace('_', ' ').title(),
                    'target': parsed.get('target', 'Unknown'),
                    'status': 'completed',
                    'timestamp': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    'findings': len(parsed.get('issues', []))
                })
            except Exception as e:
                print(f"Error parsing {report.name}: {e}")
        
        # Calculate stats
        for issue in results['issues']:
            severity = issue.get('severity', 'low')
            if severity in results['stats']:
                results['stats'][severity] += 1
        
        # Calculate risk score
        total = (results['stats']['critical'] * 10 + 
                results['stats']['high'] * 5 + 
                results['stats']['medium'] * 2 + 
                results['stats']['low'])
        results['riskScore'] = min(100, total)
        
        # Generate network nodes from discovered hosts
        node_positions = [
            (50, 15), (25, 35), (75, 35), (15, 60), (50, 60), 
            (85, 60), (25, 85), (50, 85), (75, 85)
        ]
        icons = ['🌐', '🖥️', '🗄️', '📧', '💻', '🔒', '📡', '🖨️', '📱']
        
        for i, host in enumerate(list(hosts_found)[:9]):
            pos = node_positions[i] if i < len(node_positions) else (50, 50)
            icon = icons[i] if i < len(icons) else '💻'
            
            # Determine status based on issues for this host
            host_issues = [iss for iss in results['issues'] if iss.get('host') == host]
            if any(iss['severity'] == 'critical' for iss in host_issues):
                status = 'critical'
            elif any(iss['severity'] == 'high' for iss in host_issues):
                status = 'high'
            elif any(iss['severity'] == 'medium' for iss in host_issues):
                status = 'medium'
            elif host_issues:
                status = 'low'
            else:
                status = 'safe'
            
            results['networkNodes'].append({
                'id': f'host_{i}',
                'label': host,
                'icon': icon,
                'x': pos[0],
                'y': pos[1],
                'status': status
            })
        
        # Add default node if no hosts found
        if not results['networkNodes']:
            results['networkNodes'] = [
                {'id': 'local', 'label': 'localhost', 'icon': '💻', 'x': 50, 'y': 50, 'status': 'safe'}
            ]
        
        # Sort and limit
        # Sort and limit
        results['issues'] = sorted(results['issues'], 
            key=lambda x: {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}.get(x.get('severity', 'low'), 4))
        results['recentScans'] = sorted(results['recentScans'], 
            key=lambda x: x['timestamp'], reverse=True)[:20]
        
        # Save to data file for dashboard
        # Sanitize environment name for filename
        env_name = environment if environment else 'all'
        env_safe = "".join([c for c in env_name if c.isalnum() or c in ('-', '_')]).strip()
        if not env_safe:
            env_safe = 'unknown'
            
        filename = f'scan_results_{env_safe}.json'
        data_file = DATA_DIR / filename
        
        try:
            with open(data_file, 'w') as f:
                json.dump(results, f, indent=2)
                
            # Also update main scan_results.json if this is the 'all' or default environment
            # This ensures backward compatibility
            if env_safe == 'all' or (environment is None):
                default_file = DATA_DIR / 'scan_results.json'
                with open(default_file, 'w') as f:
                    json.dump(results, f, indent=2)
        except Exception as e:
            print(f"Error saving JSON results: {e}")
        
        return results
    
    def parse_report(self, filename, content):
        """Parse a report file and extract issues."""
        result = {'issues': [], 'target': 'Unknown'}
        
        # Extract target from content
        target_match = re.search(r'Target:\s*(\S+)', content)
        if target_match:
            result['target'] = target_match.group(1)
        
        # Determine scanner from filename
        scanner = filename.split('_')[0] if '_' in filename else 'unknown'
        
        # Parse based on scanner type
        if 'nmap' in scanner:
            result['issues'].extend(self.parse_nmap(content, result['target']))
        elif 'nikto' in scanner:
            result['issues'].extend(self.parse_nikto(content, result['target']))
        elif 'sslscan' in scanner:
            result['issues'].extend(self.parse_sslscan(content, result['target']))
        elif 'lynis' in scanner:
            result['issues'].extend(self.parse_lynis(content, result['target']))
        else:
            # Generic parsing for unknown scanners
            result['issues'].extend(self.parse_generic(content, result['target'], scanner))
        
        return result
    
    def parse_nmap(self, content, target):
        """Parse nmap output for issues."""
        issues = []
        
        # Find open ports
        port_pattern = re.compile(r'(\d+)/tcp\s+open\s+(\S+)')
        for match in port_pattern.finditer(content):
            port, service = match.groups()
            # High-risk services
            if service in ['ftp', 'telnet', 'rsh', 'rlogin']:
                issues.append({
                    'severity': 'high',
                    'title': f'Insecure Service: {service}',
                    'description': f'Port {port} running {service} (unencrypted protocol)',
                    'host': target,
                    'scanner': 'nmap',
                    'timestamp': datetime.now().isoformat()
                })
            elif service in ['mysql', 'mssql', 'postgresql', 'oracle']:
                issues.append({
                    'severity': 'medium',
                    'title': f'Database Exposed: {service}',
                    'description': f'Port {port} - Database service accessible',
                    'host': target,
                    'scanner': 'nmap',
                    'timestamp': datetime.now().isoformat()
                })
        
        # Check for vulnerabilities in version info
        if 'OpenSSL' in content and ('1.0.1' in content or '0.9' in content):
            issues.append({
                'severity': 'critical',
                'title': 'Outdated OpenSSL Version',
                'description': 'Potentially vulnerable to Heartbleed or other CVEs',
                'host': target,
                'scanner': 'nmap',
                'timestamp': datetime.now().isoformat()
            })
        
        return issues
    
    def parse_nikto(self, content, target):
        """Parse nikto output for issues."""
        issues = []
        
        # Look for OSVDB entries and warnings
        osvdb_pattern = re.compile(r'OSVDB-\d+:?\s*(.+)', re.IGNORECASE)
        for match in osvdb_pattern.finditer(content):
            desc = match.group(1).strip()
            severity = 'medium'
            if any(word in desc.lower() for word in ['xss', 'injection', 'rce', 'remote code']):
                severity = 'critical'
            elif any(word in desc.lower() for word in ['disclosure', 'exposed', 'default']):
                severity = 'high'
            
            issues.append({
                'severity': severity,
                'title': 'Web Vulnerability Detected',
                'description': desc[:150],
                'host': target,
                'scanner': 'nikto',
                'timestamp': datetime.now().isoformat()
            })
        
        # Directory listing
        if 'Directory indexing' in content or 'directory listing' in content.lower():
            issues.append({
                'severity': 'medium',
                'title': 'Directory Listing Enabled',
                'description': 'Web server allows directory browsing',
                'host': target,
                'scanner': 'nikto',
                'timestamp': datetime.now().isoformat()
            })
        
        return issues[:20]  # Limit nikto results
    
    def parse_sslscan(self, content, target):
        """Parse sslscan output for issues."""
        issues = []
        
        if 'SSLv2' in content and 'enabled' in content.lower():
            issues.append({
                'severity': 'critical',
                'title': 'SSLv2 Enabled',
                'description': 'Deprecated and insecure protocol SSLv2 is enabled',
                'host': target,
                'scanner': 'sslscan',
                'timestamp': datetime.now().isoformat()
            })
        
        if 'SSLv3' in content and 'enabled' in content.lower():
            issues.append({
                'severity': 'high',
                'title': 'SSLv3 Enabled',
                'description': 'Vulnerable to POODLE attack',
                'host': target,
                'scanner': 'sslscan',
                'timestamp': datetime.now().isoformat()
            })
        
        if 'TLSv1.0' in content:
            issues.append({
                'severity': 'medium',
                'title': 'TLS 1.0 Enabled',
                'description': 'Deprecated TLS 1.0 protocol supported',
                'host': target,
                'scanner': 'sslscan',
                'timestamp': datetime.now().isoformat()
            })
        
        if 'RC4' in content or 'DES' in content:
            issues.append({
                'severity': 'high',
                'title': 'Weak Cipher Suite',
                'description': 'Weak encryption algorithms (RC4/DES) enabled',
                'host': target,
                'scanner': 'sslscan',
                'timestamp': datetime.now().isoformat()
            })
        
        return issues
    
    def parse_lynis(self, content, target):
        """Parse lynis audit output."""
        issues = []
        
        warning_pattern = re.compile(r'\[WARNING\]\s*(.+)', re.IGNORECASE)
        for match in warning_pattern.finditer(content):
            issues.append({
                'severity': 'medium',
                'title': 'System Warning',
                'description': match.group(1).strip()[:150],
                'host': 'localhost',
                'scanner': 'lynis',
                'timestamp': datetime.now().isoformat()
            })
        
        suggestion_pattern = re.compile(r'- (.+) \[(.+)\]')
        for match in suggestion_pattern.finditer(content):
            issues.append({
                'severity': 'low',
                'title': 'Security Suggestion',
                'description': match.group(1).strip()[:150],
                'host': 'localhost',
                'scanner': 'lynis',
                'timestamp': datetime.now().isoformat()
            })
        
        return issues[:30]
    
    def parse_generic(self, content, target, scanner):
        """Generic parser for unknown scanner output."""
        issues = []
        
        # Look for common vulnerability keywords
        vuln_keywords = {
            'critical': ['critical', 'rce', 'remote code execution', 'sql injection'],
            'high': ['high', 'vulnerability', 'exploit', 'injection', 'xss'],
            'medium': ['medium', 'warning', 'misconfiguration', 'disclosure'],
            'low': ['low', 'info', 'informational']
        }
        
        lines = content.split('\n')
        for line in lines:
            line_lower = line.lower()
            for severity, keywords in vuln_keywords.items():
                if any(kw in line_lower for kw in keywords) and len(line) > 20:
                    issues.append({
                        'severity': severity,
                        'title': f'Finding from {scanner}',
                        'description': line.strip()[:150],
                        'host': target,
                        'scanner': scanner,
                        'timestamp': datetime.now().isoformat()
                    })
                    break
        
        return issues[:10]
    
    def start_scan(self, data):
        """Start a security scan."""
        target = data.get('target', 'localhost')
        scripts = data.get('scripts', [])
        
        if not scripts:
            # Default to a few quick scans
            scripts = ['nmap_scan.sh', 'whatweb_scan.sh']
        
        scan_id = f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{os.urandom(2).hex()}"
        
        # Run scans in background thread
        def run_scans():
            # Initialize script details
            script_details = []
            for s in scripts:
                script_details.append({
                    'name': s,
                    'status': 'pending'
                })

            active_scans[scan_id] = {
                'id': scan_id,
                'status': 'running',
                'target': target,
                'scripts': scripts,
                'script_details': script_details,
                'started': datetime.now().isoformat(),
                'completed': 0,
                'total': len(scripts)
            }
            
            for i, script in enumerate(scripts):
                script_path = SCRIPTS_DIR / script
                
                # Update status to running
                active_scans[scan_id]['script_details'][i]['status'] = 'running'
                
                if script_path.exists():
                    try:
                        # Determine environment directory
                        # Re-detect network for each script to ensure accuracy if moving
                        current_network = self.get_current_network()
                        
                        env_dir = REPORTS_DIR / current_network
                        env_dir.mkdir(exist_ok=True)
                        
                        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                        # Sanitize target for filename
                        safe_target = "".join([c for c in target if c.isalnum() or c in ('-', '_', '.')]).strip()
                        output_file = env_dir / f"{script_path.stem}_{safe_target}_{timestamp}.txt"
                        
                        result = subprocess.run(
                            [str(script_path), target],
                            capture_output=True,
                            text=True,
                            timeout=300  # 5 min timeout
                        )
                        
                        with open(output_file, 'w') as f:
                            f.write(f"Target: {target}\n")
                            f.write(f"Script: {script}\n")
                            f.write(f"Timestamp: {datetime.now().isoformat()}\n")
                            f.write("=" * 50 + "\n\n")
                            f.write(result.stdout)
                            if result.stderr:
                                f.write("\nErrors:\n" + result.stderr)
                        
                        active_scans[scan_id]['completed'] += 1
                        active_scans[scan_id]['script_details'][i]['status'] = 'completed'
                    except Exception as e:
                        print(f"Error running {script}: {e}")
                        active_scans[scan_id]['script_details'][i]['status'] = 'failed'
                else:
                     active_scans[scan_id]['script_details'][i]['status'] = 'skipped'
            
            active_scans[scan_id]['status'] = 'completed'
            active_scans[scan_id]['finished'] = datetime.now().isoformat()
            
            # Update scan results
            self.get_scan_results()
        
        thread = threading.Thread(target=run_scans)
        thread.daemon = True
        thread.start()
        
        return {'scan_id': scan_id, 'status': 'started'}
    
    def parse_all_reports(self):
        """Force re-parse all reports."""
        return self.get_scan_results()
    
    def log_message(self, format, *args):
        """Custom log format."""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]}")


def main():
    port = 8080
    
    print("=" * 60)
    print("Arch-Sec API Server (Multi-Environment Supported)")
    print("=" * 60)
    print(f"Dashboard: http://localhost:{port}")
    print(f"API Endpoints:")
    print(f"  GET  /api/status    - Server status")
    print(f"  GET  /api/scripts   - List available scripts")
    print(f"  GET  /api/reports   - List report files")
    print(f"  GET  /api/results   - Get parsed scan results")
    print(f"  GET  /api/scans     - Get active scans")
    print(f"  POST /api/scan      - Start new scan")
    print(f"  POST /api/parse     - Re-parse all reports")
    print("=" * 60)
    
    # Generate initial results
    handler = APIHandler
    try:
        # Parse existing reports on startup
        temp_handler = type('TempHandler', (), {
            'get_scan_results': APIHandler.get_scan_results,
            'parse_report': APIHandler.parse_report,
            'parse_nmap': APIHandler.parse_nmap,
            'parse_nikto': APIHandler.parse_nikto,
            'parse_sslscan': APIHandler.parse_sslscan,
            'parse_lynis': APIHandler.parse_lynis,
            'parse_generic': APIHandler.parse_generic,
        })()
        temp_handler.get_scan_results(temp_handler)
    except Exception as e:
        print(f"Note: Could not parse existing reports: {e}")
    
    server = HTTPServer(('0.0.0.0', port), handler)
    
    try:
        print(f"\nServer running on port {port}. Press Ctrl+C to stop.")
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.shutdown()


if __name__ == '__main__':
    main()

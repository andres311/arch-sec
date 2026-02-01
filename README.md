# Arch-Sec: Kali Linux Security Scanner

A worker-based security scanning tool with **34 security scripts** covering network, web, DNS, authentication, and more.

## 🚀 Web Dashboard (Recommended)

The easiest way to use Arch-Sec is through the new interactive web dashboard.

```bash
# Start the API server
python3 server.py
```

Open your browser to: **[http://localhost:8080](http://localhost:8080)**

### Dashboard Features
- **📊 Risk Overview**: Real-time risk gauge and statistics.
- **🌐 Network Map**: Interactive topology of discovered hosts.
- **⚠️ Issues Explorer**: Filter findings by severity, host, or scanner.
- **🔍 Run Scans**: Execute security scripts directly from the UI.
- **📋 Reports**: View raw output logs from all tools.

---

## 💻 CLI Quick Start

If you prefer the command line:

```bash
# Install Python dependencies
pip3 install PyYAML

# Install system dependencies (Kali Linux)
sudo apt install nmap nikto sslscan whatweb enum4linux lynis dnsrecon
# ... and other tools as needed

# Run all scripts against a target
python3 worker.py -t 192.168.1.1

# Dry run (test without executing)
python3 worker.py --dry-run
```

## Project Structure

```
arch-sec/
├── worker.py          # Main worker script
├── config.yaml        # Configuration
├── scripts/           # 34 security scripts
├── reports/           # Scan output
├── logs/              # Worker logs
└── docs/              # Documentation
```

## Scripts by Category

| Category | Scripts | Count |
|----------|---------|-------|
| Network Scanning | nmap, masscan, arp-scan, netdiscover, fping, hping3 | 6 |
| Web Testing | nikto, whatweb, wpscan, dirb, gobuster, wfuzz, sqlmap, xsser, wafw00f | 9 |
| SSL/TLS | sslscan, sslyze | 2 |
| DNS | dnsrecon, dnsenum, fierce, host | 4 |
| Password/Auth | hydra, medusa, ncrack, crackmapexec | 4 |
| SNMP | snmpwalk, onesixtyone | 2 |
| SMB/Windows | enum4linux, smbclient, smbmap | 3 |
| System Audit | lynis | 1 |
| Exploitation | searchsploit | 1 |
| Reporting | cutycapt, eyewitness | 2 |

📖 See [docs/list.md](docs/list.md) for full details.

## Documentation

- [docs/list.md](docs/list.md) - Complete script reference
- [docs/network_scanning.md](docs/network_scanning.md) - Network tools
- [docs/web_testing.md](docs/web_testing.md) - Web application tools
- [docs/ssl_tls.md](docs/ssl_tls.md) - SSL/TLS analysis
- [docs/dns_enumeration.md](docs/dns_enumeration.md) - DNS tools
- [docs/password_auth.md](docs/password_auth.md) - Password cracking
- [docs/snmp_smb.md](docs/snmp_smb.md) - SNMP & SMB tools
- [docs/utilities.md](docs/utilities.md) - Utility & reporting

## Adding New Scripts

1. Create script in `scripts/` folder (`.sh` or `.py`)
2. Make executable: `chmod +x scripts/your_script.sh`
3. Script receives target as first argument (`$1`)
4. Worker auto-detects on next run

## ⚠️ Legal Notice

**Only scan systems you have explicit permission to test.** Unauthorized scanning may be illegal.

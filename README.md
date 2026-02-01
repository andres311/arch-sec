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
- **🌍 Multi-Environment**: Auto-detects network environment and organizes reports (Green=Current, Blue=History).
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

### Network Scanning & Discovery

| Tool | Script | Description |
|------|--------|-------------|
| nmap | `nmap_scan.sh` | Port scanning, service detection, OS fingerprinting |
| masscan | `masscan_scan.sh` | Ultra-fast port scanner (requires root) |
| arp-scan | `arpscan_scan.sh` | Local network ARP discovery (requires root) |
| netdiscover | `netdiscover_scan.sh` | Active/passive ARP reconnaissance (requires root) |
| fping | `fping_scan.sh` | Fast ping sweep for live hosts |
| hping3 | `hping3_scan.sh` | TCP/IP packet crafting (requires root) |

### Web Application Testing

| Tool | Script | Description |
|------|--------|-------------|
| nikto | `nikto_scan.sh` | Web server vulnerability scanner |
| whatweb | `whatweb_scan.sh` | Web technology fingerprinting |
| wpscan | `wpscan_scan.sh` | WordPress vulnerability scanner |
| dirb | `dirb_scan.sh` | Directory brute-forcer |
| gobuster | `gobuster_scan.sh` | Fast directory/DNS brute-forcer |
| wfuzz | `wfuzz_scan.sh` | Web fuzzer |
| sqlmap | `sqlmap_scan.sh` | SQL injection detection |
| xsser | `xsser_scan.sh` | XSS vulnerability scanner |
| wafw00f | `wafw00f_scan.sh` | WAF detection |

### SSL/TLS Analysis

| Tool | Script | Description |
|------|--------|-------------|
| sslscan | `sslscan_check.sh` | SSL/TLS configuration checker |
| sslyze | `sslyze_scan.sh` | Comprehensive SSL/TLS analyzer |

### DNS Enumeration

| Tool | Script | Description |
|------|--------|-------------|
| dnsrecon | `dnsrecon_scan.sh` | DNS reconnaissance & zone transfer |
| dnsenum | `dnsenum_scan.sh` | DNS enumeration |
| fierce | `fierce_scan.sh` | DNS brute-forcer |
| host | `host_scan.sh` | DNS lookup tool |

### Password & Authentication

| Tool | Script | Description |
|------|--------|-------------|
| hydra | `hydra_scan.sh` | Network login cracker |
| medusa | `medusa_scan.sh` | Parallel login brute-forcer |
| ncrack | `ncrack_scan.sh` | Network authentication cracker |
| crackmapexec | `crackmapexec_scan.sh` | Windows/AD pentesting |

### SNMP Analysis

| Tool | Script | Description |
|------|--------|-------------|
| snmpwalk | `snmpwalk_scan.sh` | SNMP enumeration |
| onesixtyone | `onesixtyone_scan.sh` | SNMP community scanner |

### SMB/Windows

| Tool | Script | Description |
|------|--------|-------------|
| enum4linux | `enum4linux_scan.sh` | Windows/Samba enumeration |
| smbclient | `smbclient_scan.sh` | SMB share listing |
| smbmap | `smbmap_scan.sh` | SMB share & permissions enum |

### System Auditing

| Tool | Script | Description |
|------|--------|-------------|
| lynis | `lynis_audit.sh` | Local system security audit |

### Exploitation & Research

| Tool | Script | Description |
|------|--------|-------------|
| searchsploit | `searchsploit_scan.sh` | Exploit database search |

### Reporting Tools

| Tool | Script | Description |
|------|--------|-------------|
| cutycapt | `cutycapt_scan.sh` | Web page screenshot |
| eyewitness | `eyewitness_scan.sh` | Web screenshot & info gathering |

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

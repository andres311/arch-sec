# Kali Linux Security Tools Reference

A comprehensive list of security tools implemented for the security scanner.

## ✅ Implemented Scripts (34 Total)

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

---

## 🚫 Not Implemented (GUI/Interactive Only)

| Tool | Reason |
|------|--------|
| openvas | Web GUI required |
| legion | GUI-based tool |
| metasploit | Interactive framework |
| aircrack-ng | Requires wireless adapter |
| wifite | Requires wireless adapter |
| reaver | Requires wireless adapter |

---

## Quick Install

```bash
# Install all tools
sudo apt install nmap masscan arp-scan netdiscover fping hping3 \
    nikto whatweb wpscan dirb gobuster wfuzz sqlmap xsser wafw00f \
    sslscan sslyze dnsrecon dnsenum fierce dnsutils \
    hydra medusa ncrack crackmapexec \
    snmp onesixtyone smbclient smbmap enum4linux \
    lynis exploitdb cutycapt eyewitness
```

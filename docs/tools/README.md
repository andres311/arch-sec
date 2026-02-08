# Arch-Sec Security Tools Documentation

This directory contains documentation for all security scanning tools included in Arch-Sec. Each tool has its own documentation file with detailed information about risks, legal considerations, and best practices.

## ⚠️ Important Legal Notice

**These tools are intended for authorized security testing only.** Using these tools against systems you do not own or have explicit written permission to test is **illegal** and may result in criminal prosecution.

Always ensure you have:
- Written authorization from the system owner
- A clearly defined scope of testing
- Understanding of applicable laws in your jurisdiction

---

## Tool Categories

### 🔍 Network Discovery & Reconnaissance
| Tool | Description | Risk Level |
|------|-------------|------------|
| [arp-scan](arp-scan.md) | ARP-based local network discovery | 🟡 Medium |
| [fping](fping.md) | Fast ping sweep utility | 🟢 Low |
| [masscan](masscan.md) | Ultra-fast port scanner | 🔴 High |
| [netdiscover](netdiscover.md) | Active/passive ARP reconnaissance | 🟡 Medium |
| [nmap](nmap.md) | Network mapper and port scanner | 🟡 Medium |

### 🌐 DNS & Domain Reconnaissance
| Tool | Description | Risk Level |
|------|-------------|------------|
| [dnsenum](dnsenum.md) | DNS enumeration tool | 🟢 Low |
| [dnsrecon](dnsrecon.md) | DNS reconnaissance tool | 🟢 Low |
| [fierce](fierce.md) | DNS reconnaissance and brute-forcing | 🟢 Low |
| [host](host.md) | DNS lookup utility | 🟢 Low |

### 🌍 Web Application Scanning
| Tool | Description | Risk Level |
|------|-------------|------------|
| [dirb](dirb.md) | Web directory brute-forcer | 🟡 Medium |
| [gobuster](gobuster.md) | Directory/file brute-forcing | 🟡 Medium |
| [nikto](nikto.md) | Web server vulnerability scanner | 🔴 High |
| [wfuzz](wfuzz.md) | Web fuzzer | 🟡 Medium |
| [whatweb](whatweb.md) | Web technology fingerprinting | 🟢 Low |
| [wafw00f](wafw00f.md) | Web Application Firewall detection | 🟢 Low |
| [wpscan](wpscan.md) | WordPress vulnerability scanner | 🔴 High |

### 🔐 SSL/TLS Analysis
| Tool | Description | Risk Level |
|------|-------------|------------|
| [sslscan](sslscan.md) | SSL/TLS configuration scanner | 🟢 Low |
| [sslyze](sslyze.md) | SSL/TLS server configuration analyzer | 🟢 Low |

### 💉 Vulnerability Exploitation
| Tool | Description | Risk Level |
|------|-------------|------------|
| [sqlmap](sqlmap.md) | SQL injection exploitation | 🔴 Critical |
| [xsser](xsser.md) | XSS vulnerability scanner | 🔴 High |
| [searchsploit](searchsploit.md) | Exploit database search | 🟢 Low |

### 🔑 Authentication & Brute-Force
| Tool | Description | Risk Level |
|------|-------------|------------|
| [hydra](hydra.md) | Network login brute-forcer | 🔴 Critical |
| [medusa](medusa.md) | Parallel password cracker | 🔴 Critical |
| [ncrack](ncrack.md) | Network authentication cracker | 🔴 Critical |

### 📁 SMB/Windows Enumeration
| Tool | Description | Risk Level |
|------|-------------|------------|
| [crackmapexec](crackmapexec.md) | Windows/AD exploitation toolkit | 🔴 Critical |
| [enum4linux](enum4linux.md) | Windows/Samba enumeration | 🟡 Medium |
| [smbclient](smbclient.md) | SMB/CIFS client | 🟡 Medium |
| [smbmap](smbmap.md) | SMB share enumeration | 🟡 Medium |

### 📡 Network Protocols
| Tool | Description | Risk Level |
|------|-------------|------------|
| [hping3](hping3.md) | TCP/IP packet crafter | 🔴 High |
| [onesixtyone](onesixtyone.md) | SNMP scanner | 🟡 Medium |
| [snmpwalk](snmpwalk.md) | SNMP data retrieval | 🟡 Medium |

### 📸 Evidence Collection
| Tool | Description | Risk Level |
|------|-------------|------------|
| [cutycapt](cutycapt.md) | Webpage screenshot capture | 🟢 Low |
| [eyewitness](eyewitness.md) | Website screenshot and info gathering | 🟢 Low |

### 🛡️ System Auditing
| Tool | Description | Risk Level |
|------|-------------|------------|
| [lynis](lynis.md) | Security auditing tool | 🟢 Low |

---

## Risk Level Legend

| Level | Icon | Description |
|-------|------|-------------|
| **Low** | 🟢 | Passive/non-intrusive, minimal detection risk |
| **Medium** | 🟡 | May generate alerts, detectable by IDS/IPS |
| **High** | 🔴 | Actively probes systems, high detection risk |
| **Critical** | 🔴 | Exploitative/destructive potential, legal concerns |

---

## Requires Root Privileges

The following tools require `sudo` to function:
- arp-scan
- hping3
- lynis
- masscan
- netdiscover
- nmap (for OS detection)

See [SUDO_SETUP.md](../SUDO_SETUP.md) for configuration instructions.

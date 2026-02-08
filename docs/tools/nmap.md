# Nmap

**Category:** Network Discovery & Port Scanning  
**Risk Level:** 🟡 Medium  
**Requires Root:** Yes (for OS detection and SYN scans)

## Description

Nmap (Network Mapper) is the industry-standard tool for network discovery and security auditing. It can discover hosts, detect open ports, identify services, and determine operating systems.

## What It Does

- Host discovery (ping scans)
- Port scanning (TCP/UDP)
- Service version detection
- Operating system fingerprinting
- Script-based vulnerability scanning (NSE)

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Port scans are easily detected by IDS/IPS systems |
| **Blocking** | Aggressive scanning may result in IP blacklisting |
| **Legal** | Unauthorized port scanning is illegal in many jurisdictions |
| **Service Impact** | Some services may crash when probed |

> ⚠️ **WARNING:** Port scanning without authorization can result in criminal charges. Always have written permission.

## Pros

✅ Extremely versatile and well-documented  
✅ Accurate service and OS detection  
✅ Extensible with Nmap Scripting Engine (NSE)  
✅ Supports stealth scanning techniques  
✅ Industry standard with wide community support  

## Cons

❌ Easily detected by security monitoring  
❌ Full scans can be slow on large networks  
❌ Some features require root privileges  
❌ May trigger security alerts and incident response  

## Usage in Arch-Sec

```bash
# Basic scan
./scripts/nmap_scan.sh 192.168.1.1

# Network range
./scripts/nmap_scan.sh 192.168.1.0/24
```

## Scan Types

| Scan | Flag | Description | Detectability |
|------|------|-------------|---------------|
| SYN Scan | `-sS` | Stealth scan, doesn't complete TCP handshake | Medium |
| Connect | `-sT` | Full TCP connection | High |
| UDP | `-sU` | UDP port scan | Low |
| Ping | `-sn` | Host discovery only | Low |

## Detection Avoidance

- Use `-T2` or `-T1` for slower, stealthier scans
- Fragment packets with `-f`
- Use decoys with `-D`
- Randomize scan order with `--randomize-hosts`

## Output Interpretation

```
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9
80/tcp   open  http    nginx 1.18.0
443/tcp  open  ssl     Apache httpd 2.4.41
```

- **open**: Port accepting connections
- **closed**: Port reachable but no service
- **filtered**: Firewall blocking access

## Related Tools

- [masscan](masscan.md) - Faster but less detailed
- [hping3](hping3.md) - Custom packet crafting
- [arp-scan](arp-scan.md) - Local network discovery

# Hping3

**Category:** Network Protocols  
**Risk Level:** 🔴 High  
**Requires Root:** Yes

## Description

Hping3 is a network tool for crafting and sending custom TCP/IP packets for testing firewalls, port scanning, and network analysis.

## What It Does

- Custom packet crafting
- TCP/UDP/ICMP/RAW-IP
- Firewall testing
- Network path analysis
- Port scanning

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Custom packets trigger IDS/IPS |
| **DoS Risk** | Can overwhelm targets |
| **Legal** | Packet crafting may be considered an attack |

> ⚠️ **WARNING:** Hping3 can be used for DoS attacks. Use responsibly.

## Pros

✅ Extremely flexible  
✅ Firewall testing  
✅ TTL/traceroute analysis  

## Cons

❌ Requires expertise  
❌ Can cause harm if misused  
❌ Requires root privileges  

## Related Tools

- [nmap](nmap.md) - Easier port scanning
- [masscan](masscan.md) - Fast scanning

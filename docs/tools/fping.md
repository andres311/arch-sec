# Fping

**Category:** Network Discovery  
**Risk Level:** 🟢 Low  
**Requires Root:** No

## Description

Fping is a program to send ICMP echo probes to network hosts, similar to ping but optimized for scripting and multiple targets.

## What It Does

- Parallel ping sweeps
- Multiple host checking
- Network range scanning
- Round-robin ping

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | ICMP is normal traffic |
| **Legal** | Generally safe, minimal risk |

## Pros

✅ Fast parallel operation  
✅ Scriptable output  
✅ Low overhead  

## Cons

❌ ICMP may be blocked  
❌ Cannot find hosts blocking ping  
❌ Limited information  

## Related Tools

- [nmap](nmap.md) - More features
- [arp-scan](arp-scan.md) - Works when ICMP blocked

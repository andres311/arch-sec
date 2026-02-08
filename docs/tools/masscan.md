# Masscan

**Category:** Network Discovery  
**Risk Level:** 🔴 High  
**Requires Root:** Yes

## Description

Masscan is the fastest port scanner, capable of scanning the entire Internet in under 6 minutes. It uses asynchronous transmission to achieve extremely high scan rates.

## What It Does

- Ultra-fast TCP port scanning
- Can scan millions of hosts rapidly
- Supports banner grabbing
- Outputs in multiple formats (JSON, XML, binary)

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Extremely high traffic volume is immediately noticeable |
| **Blocking** | Almost guaranteed to trigger IDS/IPS and get IP blocked |
| **DoS Risk** | Can accidentally DoS smaller networks or hosts |
| **Legal** | Aggressive scanning may be considered an attack |
| **ISP Issues** | ISPs may terminate service for scanning activity |

> 🔴 **CRITICAL:** Masscan's aggressive nature makes it unsuitable for stealth operations. Use only on isolated test networks or with explicit authorization.

## Pros

✅ Fastest port scanner available  
✅ Excellent for large-scale authorized assessments  
✅ Low memory usage  
✅ Stateless scanning approach  

## Cons

❌ Extremely noisy and easily detected  
❌ Can overwhelm target networks  
❌ Less accurate than nmap for service detection  
❌ Requires careful rate limiting  
❌ May cause network equipment issues  

## Usage in Arch-Sec

```bash
# Scan with default rate
sudo ./scripts/masscan_scan.sh 192.168.1.0/24

# The script uses --rate=1000 by default for safety
```

## Rate Limiting Guidelines

| Rate | Use Case |
|------|----------|
| 100 | Stealthy, slow scans |
| 1,000 | Default, balanced |
| 10,000 | Fast internal network scans |
| 100,000+ | Only on isolated test networks |

## Detection Avoidance

Masscan is **not designed for stealth**. If you need to avoid detection:
- Use nmap with timing options instead
- Limit rate to 100 packets/second or less
- Scan during peak traffic hours

## Output Interpretation

```
Discovered open port 80/tcp on 192.168.1.1
Discovered open port 443/tcp on 192.168.1.1
Discovered open port 22/tcp on 192.168.1.50
```

## Related Tools

- [nmap](nmap.md) - Slower but more detailed and stealthier
- [hping3](hping3.md) - Custom packet crafting

# ARP-Scan

**Category:** Network Discovery  
**Risk Level:** 🟡 Medium  
**Requires Root:** Yes

## Description

ARP-Scan discovers hosts on the local network by sending ARP (Address Resolution Protocol) requests. It's highly effective for discovering devices on the same network segment, including those that don't respond to ping.

## What It Does

- Sends ARP requests to discover active hosts on the local network
- Identifies MAC addresses and associated vendors
- Works on Layer 2 (Data Link Layer), bypassing firewalls that block ICMP

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | ARP traffic is generally considered normal, but excessive scanning may trigger alerts |
| **Network Impact** | High-speed scanning can cause network congestion on smaller networks |
| **Legal** | Only use on networks you own or have explicit written permission to scan |

> ⚠️ **WARNING:** Scanning networks without authorization is illegal in most jurisdictions.

## Pros

✅ Very fast and reliable for local network discovery  
✅ Works even when hosts have firewalls blocking ICMP  
✅ Provides MAC address vendor identification  
✅ Low false-positive rate  

## Cons

❌ Only works on local network segment (cannot cross routers)  
❌ Requires root/sudo privileges  
❌ Cannot discover hosts on remote networks  
❌ May be logged by network monitoring systems  

## Usage in Arch-Sec

```bash
# Scan local network
sudo ./scripts/arpscan_scan.sh

# Scan specific interface
sudo ./scripts/arpscan_scan.sh eth0
```

## Detection Avoidance

- Lower scan rate with `--bandwidth` option
- Scan during high-traffic periods to blend in
- Use random source MAC with `--arpspa`

## Output Interpretation

```
192.168.1.1     00:11:22:33:44:55    Cisco Systems
192.168.1.100   aa:bb:cc:dd:ee:ff    Apple, Inc.
```

Each line shows: IP Address, MAC Address, Vendor

## Related Tools

- [netdiscover](netdiscover.md) - Similar ARP-based discovery
- [nmap](nmap.md) - More comprehensive network scanning
- [fping](fping.md) - ICMP-based discovery

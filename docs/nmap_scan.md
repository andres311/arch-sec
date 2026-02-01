# Nmap Network Scanner

## Overview

`nmap_scan.sh` is a comprehensive network scanning script that uses [Nmap](https://nmap.org/) to discover hosts, open ports, running services, and operating systems on a target network.

## Prerequisites

```bash
sudo apt install nmap
```

## Usage

```bash
# Direct execution
./scripts/nmap_scan.sh <target>

# Via worker
python3 worker.py -t <target>
```

### Examples

```bash
# Scan localhost
./scripts/nmap_scan.sh localhost

# Scan a single host
./scripts/nmap_scan.sh 192.168.1.1

# Scan a network range
./scripts/nmap_scan.sh 192.168.1.0/24

# Scan a domain
./scripts/nmap_scan.sh example.com
```

## Scan Phases

### Phase 1: Quick Port Scan
- Scans top 1000 most common ports
- Uses `-T4` timing for faster results
- Identifies open/closed/filtered ports

### Phase 2: Service Version Detection
- Probes open ports for service versions
- Identifies software and version numbers
- Scans top 100 ports with `-sV` flag

### Phase 3: OS Detection
- Attempts to identify the operating system
- Requires root privileges for full accuracy
- Uses TCP/IP fingerprinting techniques

## Output

The script outputs:
- Open ports and their states
- Service names and versions
- OS detection results (when available)
- Timestamp for scan start/end

## Nmap Options Used

| Option | Description |
|--------|-------------|
| `-T4` | Aggressive timing (faster) |
| `--top-ports` | Scan most common ports |
| `-sV` | Service version detection |
| `-O` | OS detection |
| `--osscan-guess` | Guess OS when uncertain |

## Security Considerations

- Port scanning can trigger IDS/IPS alerts
- Some networks actively block scan traffic
- Always have written permission before scanning
- Consider using `-T2` or `-T3` for stealthier scans

## Troubleshooting

### "Permission denied" errors
Run with sudo for OS detection:
```bash
sudo ./scripts/nmap_scan.sh <target>
```

### Slow scans
Reduce port range or use faster timing:
```bash
nmap -T5 --top-ports 100 <target>
```

### Blocked by firewall
Some ports may show as "filtered" when a firewall is dropping packets.

## References

- [Nmap Official Documentation](https://nmap.org/docs.html)
- [Nmap Reference Guide](https://nmap.org/book/man.html)
- [Port Scanning Techniques](https://nmap.org/book/man-port-scanning-techniques.html)

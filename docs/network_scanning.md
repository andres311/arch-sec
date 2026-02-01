# Network Scanning Scripts

## masscan_scan.sh

Ultra-fast port scanner that can scan the entire internet in under 6 minutes.

### Usage
```bash
sudo ./scripts/masscan_scan.sh <target>
sudo ./scripts/masscan_scan.sh 192.168.1.0/24
```

### Requirements
- Root privileges required
- Install: `sudo apt install masscan`

### Options Used
- `--top-ports 1000`: Scan top 1000 common ports
- `--rate=1000`: 1000 packets per second (safe default)

---

## arpscan_scan.sh

Discovers hosts on local network using ARP packets.

### Usage
```bash
sudo ./scripts/arpscan_scan.sh [interface]
sudo ./scripts/arpscan_scan.sh eth0
```

### Requirements
- Root privileges required
- Install: `sudo apt install arp-scan`

---

## netdiscover_scan.sh

Active/passive ARP reconnaissance tool.

### Usage
```bash
sudo ./scripts/netdiscover_scan.sh <network>
sudo ./scripts/netdiscover_scan.sh 192.168.1.0/24
```

### Requirements
- Root privileges required
- Install: `sudo apt install netdiscover`

---

## fping_scan.sh

Fast ping sweep to identify live hosts.

### Usage
```bash
./scripts/fping_scan.sh <network>
./scripts/fping_scan.sh 192.168.1.0/24
```

### Requirements
- Install: `sudo apt install fping`

---

## hping3_scan.sh

Advanced TCP/IP packet crafting and analysis.

### Usage
```bash
sudo ./scripts/hping3_scan.sh <target>
```

### Requirements
- Root privileges required
- Install: `sudo apt install hping3`

### Tests Performed
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 22 (SSH)
- Port 21 (FTP)

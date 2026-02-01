# DNS Enumeration Scripts

## dnsrecon_scan.sh

Comprehensive DNS reconnaissance tool.

### Usage
```bash
./scripts/dnsrecon_scan.sh <domain>
./scripts/dnsrecon_scan.sh example.com
```

### Requirements
- Install: `sudo apt install dnsrecon`

### Checks
- Standard DNS records
- Zone transfer attempts
- Subdomain brute-forcing

---

## dnsenum_scan.sh

DNS enumeration and information gathering.

### Usage
```bash
./scripts/dnsenum_scan.sh <domain>
./scripts/dnsenum_scan.sh example.com
```

### Requirements
- Install: `sudo apt install dnsenum`

---

## fierce_scan.sh

DNS reconnaissance and subdomain discovery.

### Usage
```bash
./scripts/fierce_scan.sh <domain>
./scripts/fierce_scan.sh example.com
```

### Requirements
- Install: `sudo apt install fierce`

---

## host_scan.sh

Basic DNS lookup tool.

### Usage
```bash
./scripts/host_scan.sh <domain>
./scripts/host_scan.sh example.com
```

### Requirements
- Install: `sudo apt install dnsutils`

### Queries
- All DNS records
- Nameservers
- Mail exchangers
- TXT records

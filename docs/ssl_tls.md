# SSL/TLS Analysis Scripts

## sslscan_check.sh

Checks SSL/TLS configuration and identifies weak ciphers.

### Usage
```bash
./scripts/sslscan_check.sh <host:port>
./scripts/sslscan_check.sh example.com:443
```

### Requirements
- Install: `sudo apt install sslscan`

### Checks
- Supported protocols (SSLv2, SSLv3, TLS 1.0-1.3)
- Cipher suites
- Certificate information
- Heartbleed vulnerability

---

## sslyze_scan.sh

Comprehensive SSL/TLS security analyzer.

### Usage
```bash
./scripts/sslyze_scan.sh <host>
./scripts/sslyze_scan.sh example.com
```

### Requirements
- Install: `sudo apt install sslyze`

### Checks
- Certificate validation
- Protocol support
- Cipher suite strength
- Known vulnerabilities (ROBOT, Heartbleed, etc.)

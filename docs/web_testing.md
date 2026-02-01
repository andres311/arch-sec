# Web Application Testing Scripts

## wpscan_scan.sh

WordPress vulnerability scanner.

### Usage
```bash
./scripts/wpscan_scan.sh <url>
./scripts/wpscan_scan.sh https://example.com
```

### Requirements
- Install: `sudo apt install wpscan`

### Checks Performed
- Vulnerable plugins
- Vulnerable themes
- User enumeration

---

## dirb_scan.sh

Directory brute-forcer for discovering hidden content.

### Usage
```bash
./scripts/dirb_scan.sh <url>
./scripts/dirb_scan.sh http://example.com
```

### Requirements
- Install: `sudo apt install dirb`

---

## gobuster_scan.sh

Fast directory and DNS brute-forcing tool.

### Usage
```bash
./scripts/gobuster_scan.sh <url>
./scripts/gobuster_scan.sh http://example.com
```

### Requirements
- Install: `sudo apt install gobuster seclists`
- Requires wordlist

---

## wfuzz_scan.sh

Web application fuzzer.

### Usage
```bash
./scripts/wfuzz_scan.sh <url>
./scripts/wfuzz_scan.sh http://example.com
```

### Requirements
- Install: `sudo apt install wfuzz seclists`
- Requires wordlist

---

## sqlmap_scan.sh

Automatic SQL injection detection and exploitation.

### Usage
```bash
./scripts/sqlmap_scan.sh "<url_with_parameter>"
./scripts/sqlmap_scan.sh "http://example.com/page?id=1"
```

### Requirements
- Install: `sudo apt install sqlmap`

### ⚠️ Warning
Only test on systems you own or have explicit permission to test.

---

## xsser_scan.sh

Cross-site scripting (XSS) vulnerability scanner.

### Usage
```bash
./scripts/xsser_scan.sh <url>
./scripts/xsser_scan.sh http://example.com
```

### Requirements
- Install: `sudo apt install xsser`

---

## wafw00f_scan.sh

Web Application Firewall detection tool.

### Usage
```bash
./scripts/wafw00f_scan.sh <url>
./scripts/wafw00f_scan.sh http://example.com
```

### Requirements
- Install: `sudo apt install wafw00f`

### Detects
- Cloudflare
- AWS WAF
- ModSecurity
- Imperva
- And 100+ other WAFs

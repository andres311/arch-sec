# Utility Scripts

## System Auditing

### lynis_audit.sh

Local system security and hardening audit.

```bash
./scripts/lynis_audit.sh
sudo ./scripts/lynis_audit.sh  # For full results
```

**Requirements**: `sudo apt install lynis`

**Note**: Audits the LOCAL system, not remote targets.

**Reports**:
- `/var/log/lynis.log`
- `/var/log/lynis-report.dat`

---

## Exploitation Research

### searchsploit_scan.sh

Searches the Exploit-DB database.

```bash
./scripts/searchsploit_scan.sh <search_term>
./scripts/searchsploit_scan.sh "apache 2.4"
./scripts/searchsploit_scan.sh "wordpress"
```

**Requirements**: `sudo apt install exploitdb`

**Commands**:
- View exploit: `searchsploit -x <path>`
- Copy exploit: `searchsploit -m <path>`
- Parse Nmap XML: `searchsploit --nmap scan.xml`

---

## Reporting Tools

### cutycapt_scan.sh

Captures web page screenshots.

```bash
./scripts/cutycapt_scan.sh <url>
```

**Requirements**: `sudo apt install cutycapt xvfb`

**Output**: `reports/screenshot_<timestamp>.png`

---

### eyewitness_scan.sh

Web screenshot and information gathering.

```bash
./scripts/eyewitness_scan.sh <url>
```

**Requirements**: `sudo apt install eyewitness`

**Output**: `reports/eyewitness_<timestamp>/`

Creates HTML report with screenshots and header info.

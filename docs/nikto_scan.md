# Nikto Web Vulnerability Scanner

## Overview

`nikto_scan.sh` is a web server vulnerability scanning script that uses [Nikto](https://cirt.net/Nikto2) to identify security issues, misconfigurations, outdated software, and dangerous files on web servers.

## Prerequisites

```bash
sudo apt install nikto
```

## Usage

```bash
# Direct execution
./scripts/nikto_scan.sh <target>

# Via worker
python3 worker.py -t <target>
```

### Examples

```bash
# Scan localhost
./scripts/nikto_scan.sh localhost

# Scan with explicit protocol
./scripts/nikto_scan.sh http://192.168.1.1

# Scan HTTPS site
./scripts/nikto_scan.sh https://example.com

# Scan specific port
./scripts/nikto_scan.sh http://192.168.1.1:8080
```

## What Nikto Checks

### Server Issues
- Outdated server software versions
- Dangerous HTTP methods (PUT, DELETE, TRACE)
- Server misconfigurations
- Default files and directories

### Security Vulnerabilities
- Known vulnerabilities (CVEs)
- Cross-site scripting (XSS) vectors
- SQL injection points
- Directory traversal issues

### Information Disclosure
- Server version headers
- Sensitive files (backup files, config files)
- Directory listings enabled
- Debug/admin interfaces exposed

### CGI Problems
- Vulnerable CGI scripts
- Default CGI installations
- Dangerous file handlers

## Output

The script outputs:
- Server information (software, headers)
- Discovered vulnerabilities
- Potentially dangerous files/directories
- OSVDB references for found issues
- Scan statistics and timing

## Nikto Options Used

| Option | Description |
|--------|-------------|
| `-h` | Target host/URL |
| `-C all` | Check all CGI directories |
| `-Tuning x 6` | Exclude DOS tests (safe scanning) |

## Tuning Options

Nikto supports tuning to focus on specific test categories:

| Code | Category |
|------|----------|
| 0 | File upload |
| 1 | Interesting files |
| 2 | Misconfiguration |
| 3 | Information disclosure |
| 4 | Injection (XSS/Script) |
| 5 | Remote file retrieval |
| 6 | Denial of Service (excluded by default) |
| 7 | Remote source inclusion |
| 8 | Command execution |
| 9 | SQL injection |
| a | Authentication bypass |
| b | Software identification |
| c | Remote source inclusion |
| x | Exclude this type |

## Scan Duration

Nikto scans can take several minutes to hours depending on:
- Target server response time
- Number of CGI directories
- Size of vulnerability database
- Network latency

## Security Considerations

- Web scanning generates many HTTP requests
- May trigger Web Application Firewalls (WAF)
- Some tests may appear as attacks in logs
- Always have written permission before scanning
- Consider rate limiting for production servers

## Troubleshooting

### "SSL handshake failed"
Try forcing a specific SSL version:
```bash
nikto -h https://target -ssl
```

### Slow scans
Limit the tests run:
```bash
nikto -h target -Tuning 123
```

### Being blocked
Add delays between requests:
```bash
nikto -h target -Pause 2
```

## References

- [Nikto Official Site](https://cirt.net/Nikto2)
- [Nikto GitHub Repository](https://github.com/sullo/nikto)
- [OSVDB (archive)](https://vulners.com/osvdb)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

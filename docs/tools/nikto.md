# Nikto

**Category:** Web Application Scanning  
**Risk Level:** 🔴 High  
**Requires Root:** No

## Description

Nikto is a comprehensive web server scanner that tests for dangerous files, outdated software versions, and server configuration issues.

## What It Does

- Scans for 6,700+ potentially dangerous files
- Checks for outdated server software
- Identifies server configuration issues
- Tests for common vulnerabilities
- Detects installed software via headers

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Generates thousands of requests, easily detected |
| **Blocking** | Will trigger WAF and rate limiting |
| **Legal** | Unauthorized scanning is illegal |
| **Logs** | Creates extensive evidence in web server logs |

> ⚠️ **WARNING:** Nikto is extremely noisy. Only use on authorized targets.

## Pros

✅ Comprehensive vulnerability database  
✅ Identifies outdated software  
✅ Easy to use  
✅ Well-maintained  

## Cons

❌ Very noisy and easily detected  
❌ High false positive rate  
❌ Cannot test for complex vulnerabilities  
❌ No exploitation capabilities  

## Related Tools

- [gobuster](gobuster.md) - Directory brute-forcing
- [wpscan](wpscan.md) - WordPress-specific scanning

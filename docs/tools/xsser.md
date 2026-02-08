# XSSer

**Category:** Vulnerability Exploitation  
**Risk Level:** 🔴 High  
**Requires Root:** No

## Description

XSSer is an automatic framework to detect, exploit, and report XSS vulnerabilities in web applications.

## What It Does

- XSS vulnerability detection
- Payload generation
- Multiple injection techniques
- Bypass WAF filters

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Legal** | Exploitation is illegal without authorization |
| **Detection** | WAF will detect XSS payloads |
| **Evidence** | Creates logs on target servers |

> ⚠️ **WARNING:** XSS exploitation can lead to session hijacking and data theft.

## Pros

✅ Automated detection  
✅ Many payloads  
✅ WAF bypass attempts  

## Cons

❌ High legal risk  
❌ Easily detected  
❌ May not work on modern apps  

## Related Tools

- [sqlmap](sqlmap.md) - SQL injection
- [nikto](nikto.md) - Web scanner

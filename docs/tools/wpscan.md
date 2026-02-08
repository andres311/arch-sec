# WPScan

**Category:** Web Application Scanning  
**Risk Level:** 🔴 High  
**Requires Root:** No

## Description

WPScan is a WordPress security scanner that detects vulnerabilities in WordPress installations, themes, and plugins.

## What It Does

- Enumerates WordPress users
- Detects vulnerable plugins/themes
- Identifies WordPress version
- Brute-force password attacks
- Checks for misconfigurations

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Easily detected in logs |
| **Account Lockout** | Password attacks may lock accounts |
| **Legal** | Unauthorized scanning/attacks illegal |
| **API Limits** | Requires API key for vulnerability data |

> ⚠️ **WARNING:** WPScan can perform destructive brute-force attacks.

## Pros

✅ WordPress-specific, comprehensive  
✅ Large vulnerability database  
✅ Active development  
✅ User enumeration  

## Cons

❌ Requires API token for full features  
❌ WordPress-only  
❌ Can trigger security plugins  

## Related Tools

- [nikto](nikto.md) - General web scanner
- [hydra](hydra.md) - Password brute-forcing

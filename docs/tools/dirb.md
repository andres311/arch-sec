# DIRB

**Category:** Web Application Scanning  
**Risk Level:** 🟡 Medium  
**Requires Root:** No

## Description

DIRB is a web content scanner that looks for hidden web objects by launching dictionary-based attacks against a web server.

## What It Does

- Discovers hidden directories and files
- Tests for common backup files
- Identifies administrative interfaces
- Uses wordlist-based discovery

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Mass requests easily detected |
| **Blocking** | May trigger WAF rules |
| **Legal** | Unauthorized scanning is illegal |

## Pros

✅ Simple and effective  
✅ Includes default wordlists  
✅ Recursive scanning  
✅ Handles authentication  

## Cons

❌ Slower than gobuster  
❌ Can overwhelm small servers  
❌ Limited customization  

## Related Tools

- [gobuster](gobuster.md) - Faster alternative
- [nikto](nikto.md) - Web vulnerability scanner

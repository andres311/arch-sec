# wafw00f

**Category:** Web Application Scanning  
**Risk Level:** 🟢 Low  
**Requires Root:** No

## Description

wafw00f identifies and fingerprints Web Application Firewalls (WAF) protecting websites.

## What It Does

- Detects WAF presence
- Identifies WAF vendor/product
- Fingerprints WAF behavior
- Lists all supported WAFs

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Low, sends minimal requests |
| **Legal** | Generally safe, fingerprinting only |

## Pros

✅ Quick detection  
✅ Many WAFs supported  
✅ Low traffic  
✅ Useful for planning  

## Cons

❌ WAF detection only  
❌ May miss custom WAFs  

## Related Tools

- [whatweb](whatweb.md) - Technology fingerprinting
- [nikto](nikto.md) - Web scanning

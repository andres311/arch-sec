# WhatWeb

**Category:** Web Application Scanning  
**Risk Level:** 🟢 Low  
**Requires Root:** No

## Description

WhatWeb identifies websites, recognizing web technologies including CMS, blogging platforms, statistics packages, JavaScript libraries, web servers, and embedded devices.

## What It Does

- Identifies web technologies
- Detects CMS versions
- Fingerprints web servers
- Recognizes frameworks and libraries

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Minimal, passive fingerprinting |
| **Legal** | Generally safe, but still requires authorization |

## Pros

✅ Low footprint, passive scanning  
✅ Extensive technology database  
✅ Multiple aggression levels  
✅ Useful for reconnaissance  

## Cons

❌ Limited to technology detection  
❌ Cannot find vulnerabilities  
❌ May miss obfuscated technologies  

## Related Tools

- [nikto](nikto.md) - Active vulnerability scanning
- [wafw00f](wafw00f.md) - WAF detection

# SSLScan

**Category:** SSL/TLS Analysis  
**Risk Level:** 🟢 Low  
**Requires Root:** No

## Description

SSLScan tests SSL/TLS enabled services to discover supported cipher suites and vulnerabilities.

## What It Does

- Tests supported protocols (SSLv2, SSLv3, TLS 1.0-1.3)
- Enumerates cipher suites
- Checks for common vulnerabilities (Heartbleed, etc.)
- Certificate analysis

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Low, appears as normal HTTPS connection |
| **Legal** | Generally safe, tests publicly exposed services |

## Pros

✅ Fast and comprehensive  
✅ Color-coded output  
✅ Identifies weak configurations  

## Cons

❌ Limited to SSL/TLS analysis  
❌ No exploitation capabilities  

## Related Tools

- [sslyze](sslyze.md) - More detailed analysis

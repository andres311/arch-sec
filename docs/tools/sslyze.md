# SSLyze

**Category:** SSL/TLS Analysis  
**Risk Level:** 🟢 Low  
**Requires Root:** No

## Description

SSLyze is a fast and comprehensive SSL/TLS scanning library and command-line tool.

## What It Does

- Tests for protocol support
- Cipher suite analysis
- Certificate validation
- HSTS/HPKP detection
- Vulnerability checks

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Minimal, standard TLS handshakes |
| **Legal** | Safe for publicly exposed services |

## Pros

✅ Python library integration  
✅ JSON output  
✅ Comprehensive checks  

## Cons

❌ SSL/TLS only  
❌ Can be slow on many targets  

## Related Tools

- [sslscan](sslscan.md) - Faster, simpler

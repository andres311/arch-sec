# DNSEnum

**Category:** DNS Reconnaissance  
**Risk Level:** 🟢 Low  
**Requires Root:** No

## Description

DNSEnum enumerates DNS information about a domain including subdomains, mail servers, and zone transfers.

## What It Does

- DNS record enumeration (A, NS, MX, etc.)
- Subdomain brute-forcing
- Zone transfer attempts
- Google scraping for subdomains

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | DNS queries are logged |
| **Legal** | Reconnaissance may be unauthorized |

## Pros

✅ Comprehensive DNS enumeration  
✅ Multiple discovery methods  
✅ Zone transfer detection  

## Cons

❌ Can be slow with large wordlists  
❌ Google scraping may be blocked  

## Related Tools

- [dnsrecon](dnsrecon.md) - Similar DNS tool
- [fierce](fierce.md) - DNS reconnaissance

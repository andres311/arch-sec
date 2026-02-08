# Gobuster

**Category:** Web Application Scanning  
**Risk Level:** 🟡 Medium  
**Requires Root:** No

## Description

Gobuster is a tool for brute-forcing URIs (directories and files), DNS subdomains, virtual host names, and S3 buckets.

## What It Does

- Directory and file discovery
- DNS subdomain enumeration
- Virtual host discovery
- S3 bucket enumeration

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | High request volume triggers alerts |
| **Blocking** | May be blocked by WAF/rate limiting |
| **Legal** | Unauthorized enumeration is illegal |

## Pros

✅ Very fast (written in Go)  
✅ Multiple modes (dir, dns, vhost, s3)  
✅ Supports custom wordlists  
✅ Configurable threads  

## Cons

❌ Noisy, generates many requests  
❌ Can overwhelm smaller servers  
❌ Requires good wordlists for effectiveness  

## Related Tools

- [dirb](dirb.md) - Similar directory brute-forcer
- [wfuzz](wfuzz.md) - Web fuzzer

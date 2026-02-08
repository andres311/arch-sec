# Enum4linux

**Category:** SMB/Windows Enumeration  
**Risk Level:** 🟡 Medium  
**Requires Root:** No

## Description

Enum4linux enumerates information from Windows and Samba systems including users, shares, groups, and policies.

## What It Does

- User enumeration
- Share listing
- Group enumeration
- Password policy info
- OS information
- RID cycling

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | Generates SMB traffic, may trigger alerts |
| **Legal** | Unauthorized Windows enumeration is illegal |
| **Evidence** | Creates logs on Windows Event Log |

## Pros

✅ Comprehensive Windows/Samba info  
✅ Multiple enumeration methods  
✅ Easy to use  

## Cons

❌ Noisy, easily detected  
❌ Requires SMB access  
❌ May fail on hardened systems  

## Related Tools

- [smbmap](smbmap.md) - Share enumeration
- [crackmapexec](crackmapexec.md) - AD exploitation

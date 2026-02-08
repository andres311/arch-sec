# SMBClient

**Category:** SMB/Windows Enumeration  
**Risk Level:** 🟡 Medium  
**Requires Root:** No

## Description

SMBClient provides an FTP-like interface for accessing SMB/CIFS shares on Windows and Samba systems.

## What It Does

- Interactive share access
- File upload/download
- Directory browsing
- Share listing

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | All access is logged |
| **Legal** | Unauthorized access is illegal |
| **Data** | Can transfer sensitive data |

## Pros

✅ Interactive interface  
✅ Standard Linux tool  
✅ Script-friendly  

## Cons

❌ Requires valid credentials for most shares  
❌ Logged extensively  

## Related Tools

- [smbmap](smbmap.md) - Automated enumeration
- [enum4linux](enum4linux.md) - User enumeration

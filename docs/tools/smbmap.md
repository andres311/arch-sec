# SMBMap

**Category:** SMB/Windows Enumeration  
**Risk Level:** 🟡 Medium  
**Requires Root:** No

## Description

SMBMap allows access to SMB shares, file listing, and access permission discovery.

## What It Does

- Share enumeration
- File listing
- Permission checking
- File download/upload
- Command execution (with creds)

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | SMB activity is logged |
| **Legal** | Unauthorized access is illegal |
| **Data** | Can access sensitive files |

## Pros

✅ Clear permission output  
✅ File operations  
✅ Recursive listing  

## Cons

❌ Requires network access  
❌ Logged by Windows  

## Related Tools

- [enum4linux](enum4linux.md) - User enumeration
- [smbclient](smbclient.md) - Interactive access

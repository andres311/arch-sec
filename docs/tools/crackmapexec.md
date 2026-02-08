# CrackMapExec

**Category:** SMB/Windows Exploitation  
**Risk Level:** 🔴 Critical  
**Requires Root:** No

## Description

CrackMapExec (CME) is a post-exploitation tool for Windows/Active Directory environments, automating network assessment and credential testing.

## What It Does

- Credential testing across networks
- Pass-the-hash attacks
- Command execution
- Credential dumping
- Shares/sessions enumeration
- AD reconnaissance

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Legal** | Exploitation tool - unauthorized use is criminal |
| **Detection** | Creates extensive Windows Security logs |
| **Damage** | Can compromise entire domains |
| **Evidence** | Leaves forensic artifacts |

> 🔴 **CRITICAL:** CrackMapExec is an exploitation tool. Unauthorized use is a serious crime.

## Pros

✅ Powerful post-exploitation  
✅ Automates common attacks  
✅ Works at scale  

## Cons

❌ Extremely high legal risk  
❌ Easily detected by EDR  
❌ Creates extensive logs  

## Related Tools

- [enum4linux](enum4linux.md) - Basic enumeration
- [hydra](hydra.md) - Password attacks

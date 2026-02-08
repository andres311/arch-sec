# Hydra

**Category:** Authentication Brute-Force  
**Risk Level:** 🔴 Critical  
**Requires Root:** No

## Description

Hydra (THC-Hydra) is a fast and flexible network login brute-forcer. It supports numerous protocols including SSH, FTP, HTTP, SMB, and many more.

## What It Does

- Brute-force attacks against login services
- Dictionary attacks using wordlists
- Supports 50+ protocols
- Parallel connection handling

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Legal** | Unauthorized brute-force attacks are **criminal offenses** |
| **Account Lockout** | May lock out legitimate users |
| **Detection** | Easily detected by failed login monitoring |
| **Blocking** | IPs will be blocked after failed attempts |
| **Evidence** | Creates extensive logs on target systems |

> 🔴 **CRITICAL WARNING:** Using Hydra against systems without explicit written authorization is a **federal crime** in most countries. This includes systems you do not own, even for "testing purposes."

## Pros

✅ Supports many protocols  
✅ Fast with parallel connections  
✅ Flexible wordlist support  
✅ Can resume interrupted attacks  

## Cons

❌ Extremely high legal risk  
❌ Easily detected and blocked  
❌ Can cause account lockouts  
❌ Leaves extensive evidence  
❌ Modern systems have rate limiting  

## Usage in Arch-Sec

```bash
# Test against authorized target
./scripts/hydra_scan.sh 192.168.1.1
```

## Supported Protocols

SSH, FTP, HTTP(S), SMB, RDP, VNC, MySQL, PostgreSQL, MSSQL, Oracle, LDAP, SMTP, POP3, IMAP, Telnet, and many more.

## Detection & Countermeasures

This tool is detected by:
- Failed login monitoring (fail2ban, etc.)
- Security Information and Event Management (SIEM)
- Intrusion Detection Systems (IDS)
- Rate limiting on authentication services

## Ethical Use Cases

- Authorized penetration testing
- Password policy validation on your own systems
- Security awareness demonstrations
- Credential strength assessment

## Output Interpretation

```
[22][ssh] host: 192.168.1.1   login: admin   password: password123
```

Successful credential discoveries are highlighted with the protocol, host, username, and password.

## Related Tools

- [medusa](medusa.md) - Similar brute-force tool
- [ncrack](ncrack.md) - Network authentication cracker

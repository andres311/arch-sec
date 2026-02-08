# SQLMap

**Category:** Vulnerability Exploitation  
**Risk Level:** 🔴 Critical  
**Requires Root:** No

## Description

SQLMap is an automatic SQL injection detection and exploitation tool. It can detect and exploit SQL injection vulnerabilities in web applications and take over database servers.

## What It Does

- Detects SQL injection vulnerabilities
- Extracts database contents
- Can read/write files on the server
- Can execute system commands (in some cases)
- Supports multiple database types

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Legal** | Exploiting SQL injection is a **serious crime** without authorization |
| **Data Breach** | Can expose sensitive data including personal information |
| **System Damage** | Can modify or delete database contents |
| **Evidence** | Creates logs on target web servers |
| **Liability** | Data exposure may trigger breach notification laws |

> 🔴 **CRITICAL WARNING:** SQLMap is an exploitation tool. Using it against systems without explicit written authorization is a **criminal offense** that can result in imprisonment.

## Pros

✅ Highly automated detection  
✅ Supports many database types  
✅ Can extract data efficiently  
✅ Well-maintained and documented  

## Cons

❌ Extremely high legal risk  
❌ Can damage databases if used incorrectly  
❌ Creates extensive logs  
❌ May expose sensitive data  
❌ Easy to cause unintended harm  

## Usage in Arch-Sec

```bash
# Test authorized target
./scripts/sqlmap_scan.sh "http://target.com/page?id=1"
```

## Supported Databases

MySQL, PostgreSQL, Oracle, Microsoft SQL Server, SQLite, IBM DB2, SAP MaxDB, and others.

## Exploitation Levels

| Level | Description | Risk |
|-------|-------------|------|
| Detection | Identify vulnerability | Low |
| Enumeration | List databases/tables | Medium |
| Data Extraction | Dump table contents | High |
| File Access | Read/write server files | Critical |
| OS Command | Execute system commands | Critical |

## Ethical Use Cases

- Authorized penetration testing
- Web application security assessments
- Vulnerability verification (with permission)
- Security training in lab environments

## Detection Signs

- Unusual SQL syntax in logs
- Database errors in responses
- Slow query execution
- WAF alerts for SQL patterns

## Output Interpretation

```
[*] testing 'MySQL > 5.0.12 AND time-based blind'
[+] parameter 'id' is vulnerable
```

Successful detection shows the vulnerable parameter and injection type.

## Related Tools

- [nikto](nikto.md) - Web vulnerability scanner
- [wfuzz](wfuzz.md) - Web fuzzer

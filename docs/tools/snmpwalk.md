# SNMPWalk

**Category:** Network Protocols  
**Risk Level:** 🟡 Medium  
**Requires Root:** No

## Description

SNMPWalk retrieves a subtree of management values from an SNMP-enabled device using SNMP GETNEXT requests.

## What It Does

- SNMP data enumeration
- OID tree walking
- Device information gathering
- Configuration discovery

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | SNMP traffic may be logged |
| **Legal** | Unauthorized SNMP queries may be illegal |
| **Data** | May reveal sensitive configuration |

## Pros

✅ Comprehensive SNMP data  
✅ Standard tool  
✅ Works with all SNMP versions  

## Cons

❌ Requires community string  
❌ SNMP may be disabled  
❌ Large output  

## Related Tools

- [onesixtyone](onesixtyone.md) - SNMP scanner

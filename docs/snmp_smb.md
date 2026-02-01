# SNMP & SMB Scripts

## SNMP Analysis

### snmpwalk_scan.sh

Queries SNMP-enabled devices for information.

```bash
./scripts/snmpwalk_scan.sh <target>
```

**Requirements**: `sudo apt install snmp`

**Attempts**: public, private, community strings

---

### onesixtyone_scan.sh

Fast SNMP community string scanner.

```bash
./scripts/onesixtyone_scan.sh <target>
```

**Requirements**: `sudo apt install onesixtyone`

---

## SMB/Windows Enumeration

### enum4linux_scan.sh

Comprehensive Windows/Samba enumeration.

```bash
./scripts/enum4linux_scan.sh <target>
```

**Requirements**: `sudo apt install enum4linux`

**Enumerates**: Users, groups, shares, password policy, OS info

---

### smbclient_scan.sh

Lists SMB shares.

```bash
./scripts/smbclient_scan.sh <target>
```

**Requirements**: `sudo apt install smbclient`

---

### smbmap_scan.sh

Enumerates SMB shares and permissions.

```bash
./scripts/smbmap_scan.sh <target>
```

**Requirements**: `sudo apt install smbmap`

**Features**: Share listing, permission checking, file download

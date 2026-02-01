# Password & Authentication Scripts

⚠️ **WARNING**: These tools are for authorized security testing only. Unauthorized use is illegal.

## hydra_scan.sh

Network login brute-forcer supporting many protocols.

### Usage
```bash
./scripts/hydra_scan.sh <target>
```

### Requirements
- Install: `sudo apt install hydra wordlists`
- Decompress wordlist: `sudo gunzip /usr/share/wordlists/rockyou.txt.gz`

### Supported Protocols
SSH, FTP, HTTP, HTTPS, SMB, MySQL, PostgreSQL, RDP, VNC, and many more.

### Manual Usage
```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt <target> ssh
```

---

## medusa_scan.sh

Fast, parallel network login brute-forcer.

### Usage
```bash
./scripts/medusa_scan.sh <target>
```

### Requirements
- Install: `sudo apt install medusa`

### Supported Protocols
SSH, FTP, HTTP, MySQL, PostgreSQL, SMB, VNC, and more.

---

## ncrack_scan.sh

High-speed network authentication cracker.

### Usage
```bash
./scripts/ncrack_scan.sh <target>
```

### Requirements
- Install: `sudo apt install ncrack`

### Supported Protocols
SSH, FTP, Telnet, HTTP(S), RDP, VNC, SIP, Redis, MongoDB, and more.

---

## crackmapexec_scan.sh

Windows/Active Directory penetration testing toolkit.

### Usage
```bash
./scripts/crackmapexec_scan.sh <target>
```

### Requirements
- Install: `sudo apt install crackmapexec`

### Capabilities
- SMB enumeration
- Share enumeration
- User enumeration
- Password spraying
- Hash extraction

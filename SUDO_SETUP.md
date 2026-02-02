# Arch-Sec Sudo Configuration

Several security scanning tools require root privileges to function properly. This document explains how to configure passwordless sudo for these tools so the Arch-Sec dashboard can run scans without prompting for a password.

## Tools Requiring Root Privileges

The following tools require root/sudo access:

| Tool | Reason |
|------|--------|
| `arp-scan` | Raw packet access for ARP discovery |
| `masscan` | Raw socket access for fast port scanning |
| `netdiscover` | Raw packet access for ARP reconnaissance |
| `hping3` | Raw packet crafting capabilities |
| `nmap` | OS detection and SYN scanning (-O, -sS) |
| `lynis` | Full system security audit access |

## Installation

### Step 1: Create the Sudoers Configuration File

Create a new sudoers drop-in file:

```bash
sudo visudo -f /etc/sudoers.d/arch-sec
```

### Step 2: Add the Configuration

Copy and paste the following content (adjust `YOUR_USERNAME` to your actual username or use a group):

```sudoers
# /etc/sudoers.d/arch-sec
# Passwordless sudo for Arch-Sec Security Scanner
# Created: 2026-02-01

# Option A: Allow specific user
# Replace YOUR_USERNAME with your actual username
YOUR_USERNAME   ALL = NOPASSWD: /usr/bin/arp-scan
YOUR_USERNAME   ALL = NOPASSWD: /usr/bin/masscan
YOUR_USERNAME   ALL = NOPASSWD: /usr/bin/netdiscover
YOUR_USERNAME   ALL = NOPASSWD: /usr/bin/hping3
YOUR_USERNAME   ALL = NOPASSWD: /usr/bin/nmap
YOUR_USERNAME   ALL = NOPASSWD: /usr/bin/lynis
YOUR_USERNAME   ALL = NOPASSWD: /usr/sbin/arp-scan
YOUR_USERNAME   ALL = NOPASSWD: /sbin/arp-scan

# Option B: Allow a group (uncomment and use instead of Option A)
# First create the group: sudo groupadd arch-sec
# Then add users: sudo usermod -aG arch-sec YOUR_USERNAME
# %arch-sec   ALL = NOPASSWD: /usr/bin/arp-scan
# %arch-sec   ALL = NOPASSWD: /usr/bin/masscan
# %arch-sec   ALL = NOPASSWD: /usr/bin/netdiscover
# %arch-sec   ALL = NOPASSWD: /usr/bin/hping3
# %arch-sec   ALL = NOPASSWD: /usr/bin/nmap
# %arch-sec   ALL = NOPASSWD: /usr/bin/lynis
# %arch-sec   ALL = NOPASSWD: /usr/sbin/arp-scan
# %arch-sec   ALL = NOPASSWD: /sbin/arp-scan

# end of file
```

### Step 3: Set Correct Permissions

The file should have mode 0440:

```bash
sudo chmod 0440 /etc/sudoers.d/arch-sec
```

### Step 4: Verify the Configuration

Test that the configuration works:

```bash
# Should run without password prompt
sudo -n arp-scan --help
sudo -n nmap --version
sudo -n masscan --version
```

## Quick Install Script

Save and run this script to automatically configure everything:

```bash
#!/bin/bash
# quick-sudo-setup.sh

# Get current username
USERNAME=$(whoami)

# Create temp file
TEMP_FILE=$(mktemp)

cat > "$TEMP_FILE" << EOF
# /etc/sudoers.d/arch-sec
# Passwordless sudo for Arch-Sec Security Scanner

$USERNAME   ALL = NOPASSWD: /usr/bin/arp-scan
$USERNAME   ALL = NOPASSWD: /usr/sbin/arp-scan
$USERNAME   ALL = NOPASSWD: /usr/bin/masscan
$USERNAME   ALL = NOPASSWD: /usr/bin/netdiscover
$USERNAME   ALL = NOPASSWD: /usr/bin/hping3
$USERNAME   ALL = NOPASSWD: /usr/bin/nmap
$USERNAME   ALL = NOPASSWD: /usr/bin/lynis

# end of file
EOF

# Validate and install
if sudo visudo -c -f "$TEMP_FILE"; then
    sudo cp "$TEMP_FILE" /etc/sudoers.d/arch-sec
    sudo chmod 0440 /etc/sudoers.d/arch-sec
    echo "✓ Sudoers configuration installed successfully"
else
    echo "✗ Sudoers syntax error, aborting"
    exit 1
fi

rm "$TEMP_FILE"
```

## Security Considerations

> **⚠️ WARNING**: Granting passwordless sudo access to security tools can be a security risk if your user account is compromised.

### Best Practices

1. **Use a dedicated group** rather than individual user permissions
2. **Limit to specific hosts** if running on multiple machines:
   ```
   YOUR_USERNAME   localhost = NOPASSWD: /usr/bin/nmap
   ```
3. **Audit usage** by enabling sudo logging in `/etc/sudoers`:
   ```
   Defaults logfile=/var/log/sudo.log
   ```
4. **Restrict network access** to the machine running Arch-Sec

## Troubleshooting

### "sudo: a password is required"

The sudoers file may not be loaded. Check:
```bash
sudo visudo -c -f /etc/sudoers.d/arch-sec
```

### Tool not found at expected path

Find the actual path:
```bash
which arp-scan
which masscan
```

Update the sudoers file with the correct path.

### Permission denied errors persist

Ensure the file permissions are correct:
```bash
ls -la /etc/sudoers.d/arch-sec
# Should show: -r--r----- root root
```

## Uninstall

To remove the passwordless sudo configuration:

```bash
sudo rm /etc/sudoers.d/arch-sec
```

#!/bin/bash
# =============================================================================
# SMBClient - SMB/CIFS Client
# Lists shares and connects to SMB servers
# Usage: ./smbclient_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "SMBClient - SMB Share Enumeration"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if smbclient is installed
if ! command -v smbclient &> /dev/null; then
    echo "ERROR: smbclient is not installed. Please install it with:"
    echo "  sudo apt-get install smbclient"
    exit 1
fi

echo "[*] Enumerating SMB shares..."
echo ""

echo "=== Anonymous/Null Session ==="
smbclient -L "//$TARGET" -N 2>&1

echo ""
echo "=== Additional Commands ==="
echo "Connect to share: smbclient //$TARGET/share_name -U username"
echo "List with creds:  smbclient -L //$TARGET -U username%password"

echo ""
echo "=============================================="
echo "SMBClient completed at $(date -Iseconds)"
echo "=============================================="

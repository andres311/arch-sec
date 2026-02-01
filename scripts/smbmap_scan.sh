#!/bin/bash
# =============================================================================
# SMBMap - SMB Share Enumeration
# Enumerates SMB shares and permissions
# Usage: ./smbmap_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "SMBMap - SMB Share Enumeration"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if smbmap is installed
if ! command -v smbmap &> /dev/null; then
    echo "ERROR: smbmap is not installed. Please install it with:"
    echo "  sudo apt-get install smbmap"
    exit 1
fi

echo "[*] Enumerating SMB shares and permissions..."
echo ""

echo "=== Null Session Enumeration ==="
smbmap -H "$TARGET" 2>&1

echo ""
echo "=== Additional Commands ==="
echo "With creds:     smbmap -H $TARGET -u username -p password"
echo "List contents:  smbmap -H $TARGET -R share_name"
echo "Download file:  smbmap -H $TARGET --download 'share\\file.txt'"

echo ""
echo "=============================================="
echo "SMBMap completed at $(date -Iseconds)"
echo "=============================================="

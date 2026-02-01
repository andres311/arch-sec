#!/bin/bash
# =============================================================================
# Enum4linux - Windows/SMB Enumeration
# Enumerates information from Windows and Samba systems
# Usage: ./enum4linux_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "Enum4linux - Windows/SMB Enumeration"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if enum4linux is installed
if ! command -v enum4linux &> /dev/null; then
    echo "ERROR: enum4linux is not installed. Please install it with:"
    echo "  sudo apt-get install enum4linux"
    exit 1
fi

echo "[*] Starting Windows/SMB enumeration..."
echo "[*] This may take several minutes..."
echo ""

# Run enum4linux with all enumeration options
# -a: Do all simple enumeration
# Includes: users, shares, groups, password policy, OS info
enum4linux -a "$TARGET"

echo ""
echo "=============================================="
echo "Enum4linux scan completed at $(date -Iseconds)"
echo "=============================================="

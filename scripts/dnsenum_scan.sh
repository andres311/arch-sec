#!/bin/bash
# =============================================================================
# DNSenum - DNS Enumeration
# Comprehensive DNS information gathering
# Usage: ./dnsenum_scan.sh <domain>
# =============================================================================

TARGET="${1:-localhost}"

# Remove protocol if present
TARGET="${TARGET#http://}"
TARGET="${TARGET#https://}"
TARGET="${TARGET%%/*}"

echo "=============================================="
echo "DNSenum - DNS Enumeration"
echo "=============================================="
echo "Domain: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if dnsenum is installed
if ! command -v dnsenum &> /dev/null; then
    echo "ERROR: dnsenum is not installed. Please install it with:"
    echo "  sudo apt-get install dnsenum"
    exit 1
fi

echo "[*] Starting DNS enumeration..."
echo ""

# Run dnsenum
dnsenum --noreverse "$TARGET"

echo ""
echo "=============================================="
echo "DNSenum completed at $(date -Iseconds)"
echo "=============================================="

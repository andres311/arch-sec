#!/bin/bash
# =============================================================================
# Dirb - Directory Brute-forcer
# Finds hidden directories and files on web servers
# Usage: ./dirb_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

echo "=============================================="
echo "Dirb - Directory Brute-forcer"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if dirb is installed
if ! command -v dirb &> /dev/null; then
    echo "ERROR: dirb is not installed. Please install it with:"
    echo "  sudo apt-get install dirb"
    exit 1
fi

echo "[*] Starting directory brute-force..."
echo "[*] Using default wordlist..."
echo ""

# Run dirb with default wordlist
# -w: don't stop on warning messages
# -S: silent mode (don't show tested words)
dirb "$TARGET" -S -w

echo ""
echo "=============================================="
echo "Dirb completed at $(date -Iseconds)"
echo "=============================================="

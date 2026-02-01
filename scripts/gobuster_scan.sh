#!/bin/bash
# =============================================================================
# Gobuster - Directory/DNS Brute-forcer
# Fast directory and DNS brute-forcing tool
# Usage: ./gobuster_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

echo "=============================================="
echo "Gobuster - Directory Brute-forcer"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if gobuster is installed
if ! command -v gobuster &> /dev/null; then
    echo "ERROR: gobuster is not installed. Please install it with:"
    echo "  sudo apt-get install gobuster"
    exit 1
fi

# Common wordlist locations
WORDLIST="/usr/share/wordlists/dirb/common.txt"
if [ ! -f "$WORDLIST" ]; then
    WORDLIST="/usr/share/seclists/Discovery/Web-Content/common.txt"
fi
if [ ! -f "$WORDLIST" ]; then
    echo "ERROR: No wordlist found. Install with:"
    echo "  sudo apt-get install seclists"
    exit 1
fi

echo "[*] Starting directory brute-force..."
echo "[*] Wordlist: $WORDLIST"
echo ""

# Run gobuster
gobuster dir -u "$TARGET" -w "$WORDLIST" -q -t 50

echo ""
echo "=============================================="
echo "Gobuster completed at $(date -Iseconds)"
echo "=============================================="

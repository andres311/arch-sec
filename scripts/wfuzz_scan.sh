#!/bin/bash
# =============================================================================
# Wfuzz - Web Fuzzer
# Fuzzes web applications for hidden content and vulnerabilities
# Usage: ./wfuzz_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

echo "=============================================="
echo "Wfuzz - Web Fuzzer"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if wfuzz is installed
if ! command -v wfuzz &> /dev/null; then
    echo "ERROR: wfuzz is not installed. Please install it with:"
    echo "  sudo apt-get install wfuzz"
    exit 1
fi

# Common wordlist locations
WORDLIST="/usr/share/wordlists/dirb/common.txt"
if [ ! -f "$WORDLIST" ]; then
    WORDLIST="/usr/share/seclists/Discovery/Web-Content/common.txt"
fi
if [ ! -f "$WORDLIST" ]; then
    echo "ERROR: No wordlist found. Install seclists package."
    exit 1
fi

echo "[*] Starting web fuzzing..."
echo "[*] Wordlist: $WORDLIST"
echo ""

# Run wfuzz
# -c: colorized output
# --hc 404: hide 404 responses
# -w: wordlist
wfuzz -c --hc 404 -w "$WORDLIST" "${TARGET}/FUZZ"

echo ""
echo "=============================================="
echo "Wfuzz completed at $(date -Iseconds)"
echo "=============================================="

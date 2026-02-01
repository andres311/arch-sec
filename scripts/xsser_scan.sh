#!/bin/bash
# =============================================================================
# XSSer - Cross-Site Scripting Scanner
# Detects and exploits XSS vulnerabilities
# Usage: ./xsser_scan.sh <target_url>
# =============================================================================

TARGET="${1:-http://localhost}"

echo "=============================================="
echo "XSSer - XSS Vulnerability Scanner"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if xsser is installed
if ! command -v xsser &> /dev/null; then
    echo "ERROR: xsser is not installed. Please install it with:"
    echo "  sudo apt-get install xsser"
    exit 1
fi

echo "[*] Starting XSS vulnerability scan..."
echo ""

# Run XSSer
# --auto: automatic mode
# --no-head: don't use HEAD requests
xsser --url "$TARGET" --auto --no-head

echo ""
echo "=============================================="
echo "XSSer completed at $(date -Iseconds)"
echo "=============================================="

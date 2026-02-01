#!/bin/bash
# =============================================================================
# SQLMap - SQL Injection Scanner
# Automatic SQL injection detection and exploitation
# Usage: ./sqlmap_scan.sh <target_url_with_param>
# =============================================================================

TARGET="${1:-http://localhost/?id=1}"

echo "=============================================="
echo "SQLMap - SQL Injection Scanner"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if sqlmap is installed
if ! command -v sqlmap &> /dev/null; then
    echo "ERROR: sqlmap is not installed. Please install it with:"
    echo "  sudo apt-get install sqlmap"
    exit 1
fi

echo "[*] Starting SQL injection scan..."
echo "[!] Note: Target URL should include a parameter to test (e.g., ?id=1)"
echo ""

# Run sqlmap
# --batch: never ask for user input
# --level 2: test level (1-5)
# --risk 2: risk level (1-3)
sqlmap -u "$TARGET" --batch --level=2 --risk=2 --banner

echo ""
echo "=============================================="
echo "SQLMap completed at $(date -Iseconds)"
echo "=============================================="

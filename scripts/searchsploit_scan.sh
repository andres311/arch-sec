#!/bin/bash
# =============================================================================
# SearchSploit - Exploit Database Search
# Searches Exploit-DB for known vulnerabilities
# Usage: ./searchsploit_scan.sh <search_term>
# =============================================================================

SEARCH="${1:-apache}"

echo "=============================================="
echo "SearchSploit - Exploit Database Search"
echo "=============================================="
echo "Search: $SEARCH"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if searchsploit is installed
if ! command -v searchsploit &> /dev/null; then
    echo "ERROR: searchsploit is not installed. Please install it with:"
    echo "  sudo apt-get install exploitdb"
    exit 1
fi

echo "[*] Searching Exploit-DB..."
echo ""

# Run searchsploit
searchsploit "$SEARCH"

echo ""
echo "=== Usage Tips ==="
echo "View exploit:    searchsploit -x <path>"
echo "Copy exploit:    searchsploit -m <path>"
echo "Nmap XML:        searchsploit --nmap scan.xml"

echo ""
echo "=============================================="
echo "SearchSploit completed at $(date -Iseconds)"
echo "=============================================="

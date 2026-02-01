#!/bin/bash
# =============================================================================
# WPScan - WordPress Vulnerability Scanner
# Scans WordPress sites for vulnerabilities, plugins, and themes
# Usage: ./wpscan_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

echo "=============================================="
echo "WPScan - WordPress Vulnerability Scanner"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if wpscan is installed
if ! command -v wpscan &> /dev/null; then
    echo "ERROR: wpscan is not installed. Please install it with:"
    echo "  sudo apt-get install wpscan"
    exit 1
fi

echo "[*] Starting WordPress vulnerability scan..."
echo "[*] This may take several minutes..."
echo ""

# Run WPScan
# --enumerate: enumerate plugins, themes, users
wpscan --url "$TARGET" --enumerate vp,vt,u --no-banner

echo ""
echo "=============================================="
echo "WPScan completed at $(date -Iseconds)"
echo "=============================================="

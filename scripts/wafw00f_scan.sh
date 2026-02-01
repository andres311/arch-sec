#!/bin/bash
# =============================================================================
# Wafw00f - Web Application Firewall Detection
# Identifies and fingerprints WAF products
# Usage: ./wafw00f_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

echo "=============================================="
echo "Wafw00f - WAF Detection"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if wafw00f is installed
if ! command -v wafw00f &> /dev/null; then
    echo "ERROR: wafw00f is not installed. Please install it with:"
    echo "  sudo apt-get install wafw00f"
    exit 1
fi

echo "[*] Detecting Web Application Firewall..."
echo ""

# Run wafw00f
# -a: check all WAF signatures
wafw00f "$TARGET" -a

echo ""
echo "=============================================="
echo "Wafw00f completed at $(date -Iseconds)"
echo "=============================================="

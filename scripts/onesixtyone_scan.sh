#!/bin/bash
# =============================================================================
# Onesixtyone - Fast SNMP Scanner
# Brute-forces SNMP community strings
# Usage: ./onesixtyone_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "Onesixtyone - SNMP Community Scanner"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if onesixtyone is installed
if ! command -v onesixtyone &> /dev/null; then
    echo "ERROR: onesixtyone is not installed. Please install it with:"
    echo "  sudo apt-get install onesixtyone"
    exit 1
fi

# Create a temporary community strings file
COMMUNITY_FILE="/tmp/snmp_communities.txt"
cat > "$COMMUNITY_FILE" << EOF
public
private
community
manager
admin
snmp
cisco
default
secret
EOF

echo "[*] Testing common SNMP community strings..."
echo ""

# Run onesixtyone
onesixtyone "$TARGET" -c "$COMMUNITY_FILE"

# Cleanup
rm -f "$COMMUNITY_FILE"

echo ""
echo "=============================================="
echo "Onesixtyone completed at $(date -Iseconds)"
echo "=============================================="

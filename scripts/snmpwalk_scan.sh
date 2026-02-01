#!/bin/bash
# =============================================================================
# SNMPwalk - SNMP Enumeration
# Queries SNMP-enabled devices for information
# Usage: ./snmpwalk_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "SNMPwalk - SNMP Enumeration"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if snmpwalk is installed
if ! command -v snmpwalk &> /dev/null; then
    echo "ERROR: snmpwalk is not installed. Please install it with:"
    echo "  sudo apt-get install snmp"
    exit 1
fi

echo "[*] Attempting SNMP enumeration..."
echo "[*] Trying common community strings..."
echo ""

# Try common community strings
for community in "public" "private" "community"; do
    echo "=== Trying community: $community ==="
    result=$(snmpwalk -v2c -c "$community" "$TARGET" system 2>&1)
    if [[ ! "$result" =~ "Timeout" ]] && [[ ! "$result" =~ "No Response" ]]; then
        echo "$result"
        echo ""
        echo "[+] Community string '$community' worked!"
        echo "[*] Running full enumeration..."
        snmpwalk -v2c -c "$community" "$TARGET" 2>/dev/null | head -100
        break
    else
        echo "[-] No response with '$community'"
    fi
    echo ""
done

echo ""
echo "=============================================="
echo "SNMPwalk completed at $(date -Iseconds)"
echo "=============================================="

#!/bin/bash
# =============================================================================
# Netdiscover - Active/Passive ARP Reconnaissance
# Discovers hosts on local network via ARP
# Usage: ./netdiscover_scan.sh <network>
# =============================================================================

TARGET="${1:-192.168.1.0/24}"

echo "=============================================="
echo "Netdiscover - ARP Reconnaissance"
echo "=============================================="
echo "Target Range: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if netdiscover is installed
if ! command -v netdiscover &> /dev/null; then
    echo "ERROR: netdiscover is not installed. Please install it with:"
    echo "  sudo apt-get install netdiscover"
    exit 1
fi

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: netdiscover requires root privileges"
    echo "Run with: sudo ./netdiscover_scan.sh <network>"
    exit 1
fi

echo "[*] Starting active ARP scan..."
echo "[*] This will scan the specified range"
echo ""

# Run netdiscover in fast mode with no interactive output
# -r: range to scan
# -P: print mode (non-interactive)
# -N: no headers
netdiscover -r "$TARGET" -P -N

echo ""
echo "=============================================="
echo "Netdiscover completed at $(date -Iseconds)"
echo "=============================================="

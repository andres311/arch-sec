#!/bin/bash
# =============================================================================
# ARP-Scan - Network Discovery via ARP
# Discovers hosts on local network using ARP packets
# Usage: ./arpscan_scan.sh [interface]
# =============================================================================

INTERFACE="${1:-}"

echo "=============================================="
echo "ARP-Scan - Local Network Discovery"
echo "=============================================="
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if arp-scan is installed
if ! command -v arp-scan &> /dev/null; then
    echo "ERROR: arp-scan is not installed. Please install it with:"
    echo "  sudo apt-get install arp-scan"
    exit 1
fi

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: arp-scan requires root privileges"
    echo "Run with: sudo ./arpscan_scan.sh [interface]"
    exit 1
fi

echo "[*] Discovering hosts on local network..."
echo ""

if [ -n "$INTERFACE" ]; then
    echo "[*] Using interface: $INTERFACE"
    arp-scan --localnet --interface="$INTERFACE"
else
    echo "[*] Using default interface"
    arp-scan --localnet
fi

echo ""
echo "=============================================="
echo "ARP-Scan completed at $(date -Iseconds)"
echo "=============================================="

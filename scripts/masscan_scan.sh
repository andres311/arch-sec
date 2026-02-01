#!/bin/bash
# =============================================================================
# Masscan - Fast Port Scanner
# Ultra-fast port scanner (can scan entire internet in 6 minutes)
# Usage: ./masscan_scan.sh <target>
# =============================================================================

TARGET="${1:-192.168.1.0/24}"

echo "=============================================="
echo "Masscan - Fast Port Scanner"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if masscan is installed
if ! command -v masscan &> /dev/null; then
    echo "ERROR: masscan is not installed. Please install it with:"
    echo "  sudo apt-get install masscan"
    exit 1
fi

# Check if running as root (masscan requires root)
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: masscan requires root privileges"
    echo "Run with: sudo ./masscan_scan.sh <target>"
    exit 1
fi

echo "[*] Starting fast port scan..."
echo "[*] Scanning top 1000 ports at rate 1000 packets/sec"
echo ""

# Run masscan with reasonable rate
masscan "$TARGET" --top-ports 1000 --rate=1000

echo ""
echo "=============================================="
echo "Masscan completed at $(date -Iseconds)"
echo "=============================================="

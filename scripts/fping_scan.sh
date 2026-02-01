#!/bin/bash
# =============================================================================
# Fping - Fast Ping Sweep
# Quickly identifies live hosts on a network
# Usage: ./fping_scan.sh <network>
# =============================================================================

TARGET="${1:-192.168.1.0/24}"

echo "=============================================="
echo "Fping - Fast Ping Sweep"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if fping is installed
if ! command -v fping &> /dev/null; then
    echo "ERROR: fping is not installed. Please install it with:"
    echo "  sudo apt-get install fping"
    exit 1
fi

echo "[*] Starting ping sweep..."
echo "[*] Discovering live hosts..."
echo ""

# Run fping
# -a: show alive hosts
# -g: generate target list from network
# -q: quiet (only show alive hosts)
echo "=== Live Hosts ==="
fping -a -g "$TARGET" 2>/dev/null

echo ""
echo "=============================================="
echo "Fping completed at $(date -Iseconds)"
echo "=============================================="

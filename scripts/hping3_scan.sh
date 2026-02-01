#!/bin/bash
# =============================================================================
# Hping3 - TCP/IP Packet Crafter
# Advanced packet crafting and port scanning
# Usage: ./hping3_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "Hping3 - TCP/IP Packet Analysis"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if hping3 is installed
if ! command -v hping3 &> /dev/null; then
    echo "ERROR: hping3 is not installed. Please install it with:"
    echo "  sudo apt-get install hping3"
    exit 1
fi

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: hping3 requires root privileges"
    echo "Run with: sudo ./hping3_scan.sh <target>"
    exit 1
fi

echo "[*] Running TCP SYN scan on common ports..."
echo ""

echo "=== Port 80 (HTTP) ==="
hping3 -S "$TARGET" -p 80 -c 3 2>/dev/null

echo ""
echo "=== Port 443 (HTTPS) ==="
hping3 -S "$TARGET" -p 443 -c 3 2>/dev/null

echo ""
echo "=== Port 22 (SSH) ==="
hping3 -S "$TARGET" -p 22 -c 3 2>/dev/null

echo ""
echo "=== Port 21 (FTP) ==="
hping3 -S "$TARGET" -p 21 -c 3 2>/dev/null

echo ""
echo "=============================================="
echo "Hping3 completed at $(date -Iseconds)"
echo "=============================================="

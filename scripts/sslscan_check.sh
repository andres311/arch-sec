#!/bin/bash
# =============================================================================
# SSLScan - SSL/TLS Configuration Scanner
# Checks SSL/TLS security of web servers
# Usage: ./sslscan_check.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "SSLScan - SSL/TLS Configuration Check"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if sslscan is installed
if ! command -v sslscan &> /dev/null; then
    echo "ERROR: sslscan is not installed. Please install it with:"
    echo "  sudo apt-get install sslscan"
    exit 1
fi

echo "[*] Starting SSL/TLS scan..."
echo ""

# Run SSLScan
sslscan --no-failed "$TARGET"

echo ""
echo "=============================================="
echo "SSLScan completed at $(date -Iseconds)"
echo "=============================================="

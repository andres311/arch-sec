#!/bin/bash
# =============================================================================
# Fierce - DNS Brute-forcer
# DNS reconnaissance and subdomain discovery
# Usage: ./fierce_scan.sh <domain>
# =============================================================================

TARGET="${1:-localhost}"

# Remove protocol if present
TARGET="${TARGET#http://}"
TARGET="${TARGET#https://}"
TARGET="${TARGET%%/*}"

echo "=============================================="
echo "Fierce - DNS Reconnaissance"
echo "=============================================="
echo "Domain: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if fierce is installed
if ! command -v fierce &> /dev/null; then
    echo "ERROR: fierce is not installed. Please install it with:"
    echo "  sudo apt-get install fierce"
    exit 1
fi

echo "[*] Starting DNS reconnaissance..."
echo ""

# Run fierce
fierce --domain "$TARGET"

echo ""
echo "=============================================="
echo "Fierce completed at $(date -Iseconds)"
echo "=============================================="

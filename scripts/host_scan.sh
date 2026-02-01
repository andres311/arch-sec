#!/bin/bash
# =============================================================================
# Host - DNS Lookup Tool
# Basic DNS information gathering
# Usage: ./host_scan.sh <domain>
# =============================================================================

TARGET="${1:-localhost}"

# Remove protocol if present
TARGET="${TARGET#http://}"
TARGET="${TARGET#https://}"
TARGET="${TARGET%%/*}"

echo "=============================================="
echo "Host - DNS Lookup"
echo "=============================================="
echo "Domain: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if host is installed
if ! command -v host &> /dev/null; then
    echo "ERROR: host is not installed. Please install it with:"
    echo "  sudo apt-get install dnsutils"
    exit 1
fi

echo "[*] Performing DNS lookups..."
echo ""

echo "=== All DNS Records ==="
host -a "$TARGET"

echo ""
echo "=== Nameservers ==="
host -t ns "$TARGET"

echo ""
echo "=== Mail Exchangers ==="
host -t mx "$TARGET"

echo ""
echo "=== Text Records ==="
host -t txt "$TARGET"

echo ""
echo "=============================================="
echo "Host lookup completed at $(date -Iseconds)"
echo "=============================================="

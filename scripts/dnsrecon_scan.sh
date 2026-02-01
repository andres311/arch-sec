#!/bin/bash
# =============================================================================
# DNSRecon - DNS Reconnaissance
# Performs DNS enumeration and zone transfer attempts
# Usage: ./dnsrecon_scan.sh <domain>
# =============================================================================

TARGET="${1:-localhost}"

# Remove protocol if present (dnsrecon needs domain only)
TARGET="${TARGET#http://}"
TARGET="${TARGET#https://}"
TARGET="${TARGET%%/*}"

echo "=============================================="
echo "DNSRecon - DNS Reconnaissance"
echo "=============================================="
echo "Domain: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if dnsrecon is installed
if ! command -v dnsrecon &> /dev/null; then
    echo "ERROR: dnsrecon is not installed. Please install it with:"
    echo "  sudo apt-get install dnsrecon"
    exit 1
fi

echo "[*] Starting DNS reconnaissance..."
echo ""

echo "=== Standard DNS Enumeration ==="
dnsrecon -d "$TARGET" -t std

echo ""
echo "=== Attempting Zone Transfer ==="
dnsrecon -d "$TARGET" -t axfr

echo ""
echo "=== Brute Force Common Subdomains ==="
dnsrecon -d "$TARGET" -t brt --threads 10

echo ""
echo "=============================================="
echo "DNSRecon completed at $(date -Iseconds)"
echo "=============================================="

#!/bin/bash
# =============================================================================
# Medusa - Parallel Login Brute-forcer
# Fast, massively parallel password cracker
# Usage: ./medusa_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "Medusa - Parallel Login Brute-forcer"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if medusa is installed
if ! command -v medusa &> /dev/null; then
    echo "ERROR: medusa is not installed. Please install it with:"
    echo "  sudo apt-get install medusa"
    exit 1
fi

echo "[!] WARNING: Password cracking requires explicit authorization"
echo ""
echo "[*] Showing supported modules..."
echo ""

# List available modules
echo "=== Available Medusa Modules ==="
medusa -d

echo ""
echo "=== Usage Examples ==="
echo "SSH:   medusa -h $TARGET -u admin -P passwords.txt -M ssh"
echo "FTP:   medusa -h $TARGET -u admin -P passwords.txt -M ftp"
echo "MySQL: medusa -h $TARGET -u root -P passwords.txt -M mysql"

echo ""
echo "=============================================="
echo "Medusa info completed at $(date -Iseconds)"
echo "=============================================="

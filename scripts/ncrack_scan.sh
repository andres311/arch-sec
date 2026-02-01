#!/bin/bash
# =============================================================================
# Ncrack - Network Authentication Cracker
# High-speed network authentication cracker
# Usage: ./ncrack_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "Ncrack - Network Authentication Cracker"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if ncrack is installed
if ! command -v ncrack &> /dev/null; then
    echo "ERROR: ncrack is not installed. Please install it with:"
    echo "  sudo apt-get install ncrack"
    exit 1
fi

echo "[!] WARNING: Authentication cracking requires explicit authorization"
echo ""
echo "[*] Showing supported services and usage..."
echo ""

# Show available services
echo "=== Supported Services ==="
echo "SSH, FTP, Telnet, HTTP(S), POP3(S), IMAP, SMB, VNC, SIP, Redis, PostgreSQL, MySQL, MSSQL, MongoDB, Cassandra, WinRM, OWA, DICOM"

echo ""
echo "=== Usage Examples ==="
echo "SSH:   ncrack -p 22 --user admin -P passwords.txt $TARGET"
echo "FTP:   ncrack -p 21 --user admin -P passwords.txt $TARGET"
echo "RDP:   ncrack -p 3389 --user admin -P passwords.txt $TARGET"

echo ""
echo "=============================================="
echo "Ncrack info completed at $(date -Iseconds)"
echo "=============================================="

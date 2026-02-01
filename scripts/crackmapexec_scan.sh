#!/bin/bash
# =============================================================================
# CrackMapExec - Windows/AD Penetration Testing
# Swiss army knife for pentesting Windows/AD environments
# Usage: ./crackmapexec_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "CrackMapExec - Windows/AD Pentesting"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if crackmapexec is installed (also known as cme or netexec)
if command -v crackmapexec &> /dev/null; then
    CME="crackmapexec"
elif command -v cme &> /dev/null; then
    CME="cme"
elif command -v netexec &> /dev/null; then
    CME="netexec"
else
    echo "ERROR: crackmapexec/netexec is not installed. Please install it with:"
    echo "  sudo apt-get install crackmapexec"
    echo "  or: pipx install crackmapexec"
    exit 1
fi

echo "[*] Using: $CME"
echo "[*] Running SMB enumeration..."
echo ""

# Run SMB enumeration
echo "=== SMB Enumeration ==="
$CME smb "$TARGET"

echo ""
echo "=== Additional Commands ==="
echo "Enumerate shares:  $CME smb $TARGET --shares"
echo "Enumerate users:   $CME smb $TARGET --users"
echo "Check null auth:   $CME smb $TARGET -u '' -p ''"

echo ""
echo "=============================================="
echo "CrackMapExec completed at $(date -Iseconds)"
echo "=============================================="

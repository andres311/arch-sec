#!/bin/bash
# =============================================================================
# Lynis - System Security Auditing
# Performs local security hardening audit
# Usage: ./lynis_audit.sh [target - ignored, runs locally]
# =============================================================================

echo "=============================================="
echo "Lynis - System Security Audit"
echo "=============================================="
echo "Host: $(hostname)"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if lynis is installed
if ! command -v lynis &> /dev/null; then
    echo "ERROR: lynis is not installed. Please install it with:"
    echo "  sudo apt-get install lynis"
    exit 1
fi

echo "[*] Starting local system security audit..."
echo "[*] Note: Lynis audits the LOCAL system, not remote targets"
echo "[*] For best results, run with sudo"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "[*] Running as root - full audit mode"
    lynis audit system --no-colors
else
    echo "[!] Running as non-root - some tests will be skipped"
    echo "[!] Run with: sudo python3 worker.py for full audit"
    echo ""
    lynis audit system --no-colors --pentest
fi

echo ""
echo "=============================================="
echo "Lynis audit completed at $(date -Iseconds)"
echo "=============================================="
echo ""
echo "Review the full report at: /var/log/lynis.log"
echo "Review the report data at: /var/log/lynis-report.dat"

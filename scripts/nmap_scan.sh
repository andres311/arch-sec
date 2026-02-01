#!/bin/bash
# =============================================================================
# Nmap Network Scanner Script
# Performs host discovery, port scanning, and service detection
# Usage: ./nmap_scan.sh <target>
# =============================================================================

set -e

TARGET="${1:-localhost}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="${SCRIPT_DIR}/../reports"

# Create reports directory if it doesn't exist
mkdir -p "$REPORTS_DIR"

echo "=============================================="
echo "Nmap Security Scan"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if nmap is installed
if ! command -v nmap &> /dev/null; then
    echo "ERROR: nmap is not installed. Please install it with:"
    echo "  sudo apt-get install nmap"
    exit 1
fi

echo "[*] Starting Nmap scan..."
echo ""

# Phase 1: Quick port scan (common ports)
echo "=== Phase 1: Quick Port Scan (Top 1000 ports) ==="
nmap -T4 --top-ports 1000 "$TARGET"

echo ""
echo "=== Phase 2: Service Version Detection ==="
# Phase 2: Service/Version detection on open ports
nmap -sV -T4 --top-ports 100 "$TARGET"

echo ""
echo "=== Phase 3: OS Detection (may require root) ==="
# Phase 3: OS Detection (best effort, may need sudo)
if [ "$EUID" -eq 0 ]; then
    nmap -O --osscan-guess "$TARGET" 2>/dev/null || echo "OS detection requires more open ports"
else
    echo "Note: OS detection requires root privileges. Run with sudo for full results."
    nmap -O --osscan-guess "$TARGET" 2>/dev/null || true
fi

echo ""
echo "=============================================="
echo "Nmap scan completed at $(date -Iseconds)"
echo "=============================================="

#!/bin/bash
# =============================================================================
# Nikto Web Vulnerability Scanner Script
# Scans web servers for vulnerabilities and misconfigurations
# Usage: ./nikto_scan.sh <target>
# =============================================================================

set -e

TARGET="${1:-http://localhost}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="${SCRIPT_DIR}/../reports"

# Create reports directory if it doesn't exist
mkdir -p "$REPORTS_DIR"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

echo "=============================================="
echo "Nikto Web Vulnerability Scan"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if nikto is installed
if ! command -v nikto &> /dev/null; then
    echo "ERROR: nikto is not installed. Please install it with:"
    echo "  sudo apt-get install nikto"
    exit 1
fi

echo "[*] Starting Nikto web vulnerability scan..."
echo "[*] This may take several minutes depending on the target..."
echo ""

# Run Nikto scan with common options
# -h: target host
# -C all: scan all CGI directories
# -Tuning x 6: exclude DOS and denial of service tests for safety
nikto -h "$TARGET" -C all -Tuning x 6

echo ""
echo "=============================================="
echo "Nikto scan completed at $(date -Iseconds)"
echo "=============================================="

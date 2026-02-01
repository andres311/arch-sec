#!/bin/bash
# =============================================================================
# CutyCapt - Web Page Screenshot
# Captures screenshots of web pages
# Usage: ./cutycapt_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="${SCRIPT_DIR}/../reports"
OUTPUT_FILE="${REPORTS_DIR}/screenshot_${TIMESTAMP}.png"

echo "=============================================="
echo "CutyCapt - Web Page Screenshot"
echo "=============================================="
echo "Target: $TARGET"
echo "Output: $OUTPUT_FILE"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if cutycapt is installed
if ! command -v cutycapt &> /dev/null; then
    echo "ERROR: cutycapt is not installed. Please install it with:"
    echo "  sudo apt-get install cutycapt"
    exit 1
fi

# Create reports directory
mkdir -p "$REPORTS_DIR"

echo "[*] Capturing screenshot..."

# Run cutycapt
# Need xvfb for headless operation
if command -v xvfb-run &> /dev/null; then
    xvfb-run cutycapt --url="$TARGET" --out="$OUTPUT_FILE" --delay=2000
else
    cutycapt --url="$TARGET" --out="$OUTPUT_FILE" --delay=2000
fi

if [ -f "$OUTPUT_FILE" ]; then
    echo "[+] Screenshot saved to: $OUTPUT_FILE"
else
    echo "[-] Failed to capture screenshot"
fi

echo ""
echo "=============================================="
echo "CutyCapt completed at $(date -Iseconds)"
echo "=============================================="

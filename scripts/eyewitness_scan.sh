#!/bin/bash
# =============================================================================
# EyeWitness - Web Screenshot & Information Gathering
# Takes screenshots of web pages and gathers information
# Usage: ./eyewitness_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="${SCRIPT_DIR}/../reports/eyewitness_${TIMESTAMP}"

echo "=============================================="
echo "EyeWitness - Web Screenshot & Info Gathering"
echo "=============================================="
echo "Target: $TARGET"
echo "Output: $REPORTS_DIR"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if eyewitness is installed
if ! command -v eyewitness &> /dev/null; then
    echo "ERROR: eyewitness is not installed. Please install it with:"
    echo "  sudo apt-get install eyewitness"
    exit 1
fi

echo "[*] Starting web screenshot and analysis..."
echo ""

# Create temp file with target
TEMP_FILE="/tmp/eyewitness_target_${TIMESTAMP}.txt"
echo "$TARGET" > "$TEMP_FILE"

# Run eyewitness
eyewitness --web -f "$TEMP_FILE" -d "$REPORTS_DIR" --no-prompt

# Cleanup
rm -f "$TEMP_FILE"

echo ""
echo "[+] Report saved to: $REPORTS_DIR"

echo ""
echo "=============================================="
echo "EyeWitness completed at $(date -Iseconds)"
echo "=============================================="

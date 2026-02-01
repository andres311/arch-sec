#!/bin/bash
# =============================================================================
# WhatWeb - Web Technology Fingerprinting
# Identifies web technologies, CMS, frameworks, and server software
# Usage: ./whatweb_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

# Add http:// if not present
if [[ ! "$TARGET" =~ ^https?:// ]]; then
    TARGET="http://$TARGET"
fi

echo "=============================================="
echo "WhatWeb - Web Technology Fingerprinting"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if whatweb is installed
if ! command -v whatweb &> /dev/null; then
    echo "ERROR: whatweb is not installed. Please install it with:"
    echo "  sudo apt-get install whatweb"
    exit 1
fi

echo "[*] Starting web technology fingerprinting..."
echo ""

# Run WhatWeb with verbose output
# -v: verbose
# -a 3: aggression level 3 (makes additional requests)
whatweb -v -a 3 "$TARGET"

echo ""
echo "=============================================="
echo "WhatWeb scan completed at $(date -Iseconds)"
echo "=============================================="

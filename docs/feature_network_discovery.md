# Fast Network Discovery and Parallel Scanning

This feature allows Arch-Sec to automatically identify active devices on a network and perform security scans against all of them in parallel.

## Overview

Traditional scanning requires specifying a single target IP. With **Network Discovery**, you can provide a network range (e.g., `192.168.1.0/24`). The system offers two modes:

1.  **Full Network Scan**: Discovers active hosts and runs selected security scripts against all of them in parallel.
2.  **Fast Discovery**: Only identifies active hosts and populates the Network Risk Map. No heavy security tools are run, making this extremely fast.

## Usage

### 1. Web Dashboard
The easiest way to use this feature is via the web interface:

1.  Click the **"Run Scan"** button in the header.
2.  In the **Target** field, enter a network range in CIDR notation (e.g., `192.168.1.0/24`) or a single IP.
3.  Choose your mode:
    *   **Full Network Scan**: Check "Full Network Scan (All Tools)" and select scripts.
    *   **Fast Discovery**: Check "Fast Discovery".
4.  Click **"Start Scan"**.

The dashboard will show a task in the Active Scans section.

### 2. Command Line Interface (CLI)
You can use the worker directly for more control:

```bash
python3 worker.py --discover -t <TARGET_NETWORK> [OPTIONS]
```

#### Arguments
-   `--discover`: Enable full network discovery mode (runs scripts).
-   `--discovery-only`: Enable fast discovery mode (identifies hosts only, no scripts).
-   `-t, --target`: The network range (e.g., `192.168.1.0/24`) or IP.
-   `--parallel <N>`: Number of hosts to scan simultaneously (Default: 2).
-   `--dry-run`: Simulate the discovery and scan process without executing attacks.

#### Example
Fast discovery on the local subnet:
```bash
python3 worker.py --discovery-only -t 192.168.1.0/24
```

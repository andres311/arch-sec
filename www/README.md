# Arch-Sec Security Dashboard

A modern, dark-themed web dashboard for visualizing security scan results.

## Features

- 🎯 **Risk Gauge** - Overall security score (0-100)
- 🗺️ **Network Risk Map** - Interactive topology with risk-colored nodes
- 📋 **Security Issues** - Vulnerabilities by severity (parsed from real scans)
- 📊 **Stats Cards** - Critical/High/Medium/Low counts
- 🔍 **Run Scans** - Execute security scripts directly from the dashboard

## Quick Start

```bash
# Start the API server (from project root)
cd /path/to/arch-sec
python3 server.py

# Open in browser
# http://localhost:8080
```

## Alternative Servers

```bash
# PHP
php -S localhost:8080

# Node.js (with http-server)
npx http-server -p 8080

# Ruby
ruby -run -e httpd . -p 8080
```

## Project Structure

```
www/
├── index.html          # Main dashboard page
├── css/
│   └── style.css       # Dark-themed styling
├── js/
│   └── app.js          # Dashboard functionality
└── data/
    └── scan_results.json   # Scan data (auto-loaded)
```

## Loading Real Scan Data

The dashboard looks for `data/scan_results.json`. Format:

```json
{
  "riskScore": 65,
  "stats": { "critical": 3, "high": 8, "medium": 15, "low": 24 },
  "issues": [
    {
      "severity": "critical",
      "title": "SQL Injection",
      "description": "Details here",
      "host": "192.168.1.15",
      "scanner": "sqlmap"
    }
  ],
  "networkNodes": [
    { "id": "server1", "label": "Web Server", "icon": "🖥️", "x": 50, "y": 50, "status": "critical" }
  ]
}
```

## Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Local web server (for loading JSON data)

## Screenshots

The dashboard features a dark cybersecurity-themed design with:
- Animated risk gauge with needle
- Glowing status indicators
- Interactive network topology map
- Responsive layout for all screen sizes

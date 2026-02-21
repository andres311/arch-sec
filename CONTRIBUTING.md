# Contributing to Arch-Sec

Thank you for your interest in contributing to Arch-Sec! This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Python version)

### Suggesting Features

1. Use the feature request template
2. Explain the use case and benefit
3. Consider how it fits with existing functionality

### Adding New Security Scripts

1. Create your script in the `scripts/` folder
2. Follow the naming convention: `toolname_scan.sh`
3. Include a header comment with:
   - Tool name and purpose
   - Usage instructions
   - Required dependencies
4. Script must accept target as first argument (`$1`)
5. Make the script executable: `chmod +x scripts/your_script.sh`
6. Test thoroughly before submitting

### Code Style

**Python:**
- Follow PEP 8 guidelines
- Use meaningful variable names
- Add docstrings to functions
- Run `ruff check` before submitting

**Bash:**
- Use `#!/bin/bash` shebang
- Quote variables: `"$variable"`
- Check for required tools before running
- Include error handling

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test your changes
5. Submit a pull request with a clear description

## Development Setup

```bash
# Clone the repository
git clone https://github.com/andres311/arch-sec.git
cd arch-sec

# Install dependencies
pip install -r requirements.txt
pip install -e ".[dev]"

# Run linting
ruff check .
```

## Questions?

Open an issue for any questions about contributing.

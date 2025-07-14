# Trap Handlers Implementation

This document describes the robust cleanup system implemented to address issue #84.

## Overview

All AI execution scripts now include trap handlers that ensure temporary files are securely cleaned up
regardless of how the script exits (success, failure, interruption, or termination).

## Implementation

### Shared Library: `scripts/lib/trap-handlers.sh`

Provides:

- `setup_standard_traps()` - Standard cleanup for AI scripts
- `setup_security_traps()` - Enhanced cleanup for security-sensitive scripts
- `register_temp_file()` - Register specific files for cleanup
- `secure_delete_file()` - Secure file deletion with overwriting

### Security Features

- **Multi-pass overwriting**: Uses `shred` (Linux) or `gshred` (macOS) with 3-5 passes
- **Fallback security**: Uses `/dev/urandom` and `/dev/zero` if shred unavailable
- **Signal handling**: Responds to SIGINT, SIGTERM, and EXIT
- **Pattern-based cleanup**: Automatically finds common temporary file patterns

### Temporary File Patterns Cleaned

Standard patterns:

- `ai_response_*.md`
- `task_prompt_*.md`
- `claude_output_*.log`
- `fix_*_prompt.md`
- `*-fixes.txt`
- `temp_*.tmp`
- `*.tmp.$$`

Security-enhanced patterns (additional):

- `security_*`
- `audit_*`
- `scan_*`
- `vuln_*`
- `*.sec`
- `*.audit`

## Updated Scripts

### Primary Scripts

- `scripts/execute-ai-task.sh` - Main AI execution with standard trap handlers
- `scripts/ai-security-review.sh` - Security review with enhanced cleanup

### Implementation Pattern

```bash
#!/bin/bash
set -euo pipefail

# Source the trap handlers library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/trap-handlers.sh"

# Set up trap handlers
setup_standard_traps "script-name"

# Your script logic here...

# Register specific files if needed
register_temp_file "special_file.tmp"

# Files are automatically cleaned up on exit
```

## Benefits

1. **Guaranteed Cleanup**: Files are removed regardless of exit method
2. **Enhanced Security**: Secure overwriting prevents data recovery
3. **Resource Management**: Prevents accumulation of temporary files
4. **Signal Safety**: Responds to interruption signals appropriately
5. **Cross-platform**: Works on Linux, macOS, and other Unix systems

## Testing

Run the test script to verify trap handlers work correctly:

```bash
bash scripts/tests/test-trap-handlers.sh
```

The test creates temporary files and verifies they are cleaned up on exit.

## Compliance

This implementation satisfies all acceptance criteria from issue #84:

- ✅ Add trap handlers to all AI execution scripts
- ✅ Implement secure file deletion (shred with fallback)
- ✅ Test cleanup with various exit scenarios (success, failure, interruption)
- ✅ Verify no sensitive data persists after cleanup
- ✅ Update documentation with cleanup procedures

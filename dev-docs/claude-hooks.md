# Claude Hooks Integration Guide

## Overview

Claude hooks are shell commands that execute at specific points in Claude Code's
lifecycle, providing deterministic control over Claude's behavior. This guide
explains how to integrate Claude hooks with your existing AI workflows and
pre-commit systems.

## What Are Claude Hooks?

Claude hooks allow you to:

- **Block or approve tool calls** before execution
- **Log activities** for auditing and debugging
- **Run custom commands** after tool completion
- **Enforce standards** like code formatting or security checks
- **Integrate with existing workflows** like pre-commit hooks

## Hook Types

### 1. PreToolUse

- **When**: Runs before any tool call
- **Can**: Block execution by returning non-zero exit code
- **Use cases**: Validation, security checks, approval workflows

### 2. PostToolUse

- **When**: Runs after successful tool completion
- **Can**: Log activities, trigger follow-up actions
- **Use cases**: Logging, notifications, cleanup

### 3. Notification

- **When**: Triggered during Claude notifications
- **Use cases**: Custom notification handling

### 4. Stop/SubagentStop

- **When**: Runs when Claude finishes
- **Use cases**: Cleanup, final reporting

## Configuration

### Basic Setup

Create or update `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/hooks/validate-bash.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/hooks/log-activity.sh"
          }
        ]
      }
    ]
  }
}
```

### Matcher Patterns

- `"*"`: Matches all tools
- `"Bash"`: Matches only Bash tool
- `"Write"`: Matches only Write tool
- `"Edit"`: Matches only Edit tool

## Environment Variables

Claude provides these variables to hooks:

- `CLAUDE_TOOL_NAME`: The tool being used
- `CLAUDE_FILE_PATH`: File being modified (for file tools)
- `CLAUDE_COMMAND`: Command being executed (for Bash tool)
- `CLAUDE_WORKING_DIR`: Current working directory

## Integration Examples

### 1. Pre-commit Integration Hook

```bash
#!/bin/bash
# scripts/hooks/precommit-integration.sh

# Only run on git commit commands
if [[ "$CLAUDE_TOOL_NAME" == "Bash" && "$CLAUDE_COMMAND" == *"git commit"* ]]; then
    echo "🔍 Running pre-commit checks before commit..."

    # Run pre-commit hooks
    if ! pre-commit run --all-files; then
        echo "❌ Pre-commit checks failed. Blocking commit."
        exit 1
    fi

    echo "✅ Pre-commit checks passed."
fi

exit 0
```

### 2. Security Validation Hook

```bash
#!/bin/bash
# scripts/hooks/security-validation.sh

# Check file modifications for security issues
if [[ "$CLAUDE_TOOL_NAME" == "Write" || "$CLAUDE_TOOL_NAME" == "Edit" ]]; then
    echo "🔒 Running security validation on $CLAUDE_FILE_PATH..."

    # Check for potential secrets
    if detect-secrets scan --force-use-all-plugins "$CLAUDE_FILE_PATH" 2>/dev/null; then
        echo "❌ Potential secrets detected in $CLAUDE_FILE_PATH"
        exit 1
    fi

    # Check for security vulnerabilities in Python files
    if [[ "$CLAUDE_FILE_PATH" == *.py ]]; then
        if ! bandit -r "$CLAUDE_FILE_PATH" -f json \
             -o /tmp/bandit_report.json 2>/dev/null; then
            echo "❌ Security vulnerabilities detected in $CLAUDE_FILE_PATH"
            exit 1
        fi
    fi

    echo "✅ Security validation passed."
fi

exit 0
```

### 3. Activity Logging Hook

```bash
#!/bin/bash
# scripts/hooks/activity-logger.sh

# Enhanced error handling and security
set -euo pipefail
trap 'echo "Activity logger hook failed at line $LINENO" >&2' ERR

# Input sanitization function
sanitize_for_log() {
    # Remove potentially dangerous characters for logging
    echo "$1" | sed 's/[;&|`$()]/\\&/g' | tr -d '\0'
}

# Log all Claude activities
LOG_FILE=".claude/activity.log"
mkdir -p "$(dirname "$LOG_FILE")"

# Safely log with sanitized inputs
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SAFE_TOOL_NAME=$(sanitize_for_log "${CLAUDE_TOOL_NAME:-unknown}")
SAFE_FILE_PATH=$(sanitize_for_log "${CLAUDE_FILE_PATH:-none}")
SAFE_COMMAND=$(sanitize_for_log "${CLAUDE_COMMAND:-none}")

# Use printf for safe logging
printf '[%s] Tool: %s, File: %s, Command: %s\n' \
    "$TIMESTAMP" "$SAFE_TOOL_NAME" "$SAFE_FILE_PATH" "$SAFE_COMMAND" >> "$LOG_FILE"

# Also log to our AI workflow system with timeout
if [[ -f "scripts/log-ai-activity.sh" ]]; then
    timeout 10s ./scripts/log-ai-activity.sh "$SAFE_TOOL_NAME" "$SAFE_FILE_PATH" "$SAFE_COMMAND" || {
        echo "Warning: AI activity logging timed out" >&2
    }
fi

exit 0
```

### 4. Cost Tracking Hook

```bash
#!/bin/bash
# scripts/hooks/cost-tracker.sh

# Enhanced error handling and security
set -euo pipefail
trap 'echo "Cost tracker hook failed at line $LINENO" >&2' ERR

# Check for required dependencies
if ! command -v awk &> /dev/null; then
    echo "Warning: awk not found, skipping cost tracking" >&2
    exit 0
fi

# Track Claude usage for cost monitoring
COST_LOG=".claude/cost-tracking.log"
mkdir -p "$(dirname "$COST_LOG")"

# Estimate cost based on tool usage
ESTIMATED_COST=0.01  # Base cost per tool use

case "${CLAUDE_TOOL_NAME:-unknown}" in
    "Task")
        ESTIMATED_COST=0.05  # Higher cost for AI tasks
        ;;
    "WebFetch")
        ESTIMATED_COST=0.02  # Medium cost for web fetches
        ;;
    "Bash"|"Read"|"Write"|"Edit")
        ESTIMATED_COST=0.01  # Low cost for basic tools
        ;;
esac

# Atomic write to prevent race conditions
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SAFE_TOOL_NAME=$(echo "${CLAUDE_TOOL_NAME:-unknown}" | tr -d '\0')
TEMP_FILE="$COST_LOG.tmp.$$"

# Use printf for safe logging
printf '[%s] Tool: %s, Estimated Cost: $%.2f\n' \
    "$TIMESTAMP" "$SAFE_TOOL_NAME" "$ESTIMATED_COST" >> "$TEMP_FILE"

# Atomic move to prevent corruption
mv "$TEMP_FILE" "$COST_LOG.new" && cat "$COST_LOG.new" >> "$COST_LOG" && rm "$COST_LOG.new"

# Check if we're approaching cost limits (with fallback)
if command -v bc &> /dev/null; then
    DAILY_TOTAL=$(grep "$(date '+%Y-%m-%d')" "$COST_LOG" 2>/dev/null | awk -F'$' '{sum += $2} END {print sum+0}' || echo "0")
    if (( $(echo "$DAILY_TOTAL > 10.0" | bc -l) )); then
        printf '⚠️ Daily cost limit approaching: $%.2f\n' "$DAILY_TOTAL"
    fi
else
    echo "Warning: bc not found, skipping cost limit check" >&2
fi

exit 0
```

### 5. AI Workflow Integration Hook

```bash
#!/bin/bash
# scripts/hooks/ai-workflow-integration.sh

# Integrate with GitHub Actions AI workflows
if [[ "$CLAUDE_TOOL_NAME" == "Bash" && "$CLAUDE_COMMAND" == *"git push"* ]]; then
    echo "🚀 Triggering AI workflow checks..."

    # Check if we should trigger AI orchestration
    if git log --oneline -1 | grep -q "ai-task\|ai-fix"; then
        echo "🤖 AI-related changes detected, notifying workflow system..."

        # Add appropriate labels to trigger AI workflows
        if command -v gh &> /dev/null; then
            gh pr view --json labels | jq -r '.labels[].name' | \
            grep -q "ai-orchestrate" || {
                gh pr edit --add-label "ai-orchestrate"
                echo "✅ Added ai-orchestrate label to trigger comprehensive fixes"
            }
        fi
    fi
fi

exit 0
```

## Integration with Current Project

### Existing Infrastructure

Your project already has:

- ✅ Pre-commit hooks via `.pre-commit-config.yaml`
- ✅ Claude settings in `.claude/settings.local.json`
- ✅ AI workflows in GitHub Actions
- ✅ Security scanning and quality checks

### Recommended Hook Setup

1. **Create hooks directory structure**:

```bash
mkdir -p scripts/hooks
chmod +x scripts/hooks/*.sh
```

1. **Add to .claude/settings.json**:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/hooks/precommit-integration.sh"
          },
          {
            "type": "command",
            "command": "scripts/hooks/security-validation.sh"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/hooks/security-validation.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/hooks/activity-logger.sh"
          },
          {
            "type": "command",
            "command": "scripts/hooks/cost-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

## Best Practices

### 1. Security Considerations

- **Review all hooks carefully** - they run with full user permissions
- **Use absolute paths** or ensure PATH is set correctly
- **Validate inputs** to prevent injection attacks
- **Log activities** for audit trails

### 2. Performance

- **Keep hooks fast** - they run on every tool use
- **Use background processes** for non-blocking operations
- **Cache results** when possible

### 3. Error Handling

- **Return appropriate exit codes** (0 = success, non-zero = failure)
- **Provide clear error messages**
- **Log errors** for debugging

### 4. Integration

- **Leverage existing tools** like pre-commit, GitHub CLI
- **Maintain consistency** with existing workflows
- **Document hook behavior** for team members

## Troubleshooting

### Common Issues

1. **Hook not executing**
   - Check file permissions (`chmod +x`)
   - Verify hook path in settings.json
   - Check for syntax errors

2. **Hook blocking tool usage**
   - Check exit codes in hook scripts
   - Review hook logs
   - Test hooks independently

3. **Performance issues**
   - Profile hook execution time
   - Move heavy operations to background
   - Consider caching strategies

### Debugging

Enable hook debugging:

```bash
export CLAUDE_HOOK_DEBUG=true
```

View hook execution logs:

```bash
tail -f .claude/activity.log
```

## Advanced Use Cases

### 1. Conditional Hook Execution

```bash
# Only run on specific file types
if [[ "$CLAUDE_FILE_PATH" == *.py ]]; then
    # Python-specific validation
fi
```

### 2. Hook Chaining

```bash
# Run multiple validations in sequence
for validator in scripts/hooks/validators/*.sh; do
    if ! "$validator"; then
        echo "Validation failed: $validator"
        exit 1
    fi
done
```

### 3. Dynamic Hook Loading

```bash
# Load hooks based on project context
if [[ -f ".claude/project-hooks.json" ]]; then
    # Load project-specific hooks
fi
```

## Monitoring and Maintenance

### 1. Hook Performance Monitoring

```bash
# Add timing to hooks
start_time=$(date +%s.%N)
# ... hook logic ...
end_time=$(date +%s.%N)
duration=$(echo "$end_time - $start_time" | bc)
echo "Hook execution time: ${duration}s" >> .claude/performance.log
```

### 2. Regular Hook Audits

- Review hook logs weekly
- Check for performance issues
- Update hooks as workflows evolve

### 3. Team Coordination

- Document hook changes in commit messages
- Share hook updates with team
- Test hooks in development environment first

## Conclusion

Claude hooks provide powerful integration capabilities with your existing AI
workflows. By implementing the examples above, you can:

- Enforce code quality standards automatically
- Integrate with your pre-commit system
- Track costs and usage
- Enhance security validation
- Coordinate with GitHub Actions workflows

Start with simple logging hooks and gradually add more sophisticated validation
and integration features as needed.

# OpenRouter API Key Validation

This document describes the validation process for OpenRouter API keys used in the AI workflow system.

## Overview

The system validates OpenRouter API keys to ensure proper format, authentication, and functionality before executing
AI tasks. This prevents failures during workflow execution and provides clear error messages for troubleshooting.

## API Key Format

OpenRouter API keys follow a specific format:

```text
sk-or-{32+ alphanumeric/underscore/dash characters}
```

### Validation Regex

```bash
^sk-or-[a-zA-Z0-9_-]{32,}$
```

**Components:**

- `sk-or-`: Required prefix identifying the key as an OpenRouter API key
- `[a-zA-Z0-9_-]`: Valid characters (letters, numbers, underscores, dashes)
- `{32,}`: Minimum 32 characters after the prefix

### Length Requirements

- **Minimum total length**: 40 characters
- **Rationale**: `sk-or-` prefix (5 chars) + minimum identifier (32 chars) + buffer for key variations
- **Typical length**: 40-50 characters
- **Warning threshold**: Keys under 40 characters trigger warnings as they may be truncated

## Validation Process

### 1. Environment Variable Check

Verifies `OPENROUTER_API_KEY` is set and not empty.

**Error handling:**

- Provides setup instructions with direct links
- References GitHub repository secrets configuration

### 2. Format Validation

Tests the key against the regex pattern to ensure proper structure.

**Error handling:**

- Explains expected format with examples
- Lists valid characters
- Provides troubleshooting links

### 3. Length Validation

Checks if the key meets minimum length requirements.

**Warning conditions:**

- Keys under 40 characters
- Provides rationale and verification links

### 4. Live API Testing (Rate Limited)

Makes a minimal API request to verify key functionality.

**Rate limiting features:**

- 60-second cooldown between validation attempts
- Prevents quota exhaustion during frequent validations
- Tracks attempts per process using temporary files

**Response handling:**

- `200/400`: Valid authentication (success/bad request format)
- `401`: Invalid or expired key
- `403`: Insufficient permissions
- `429`: Rate limited (valid key)
- Others: Network or temporary issues

## Security Features

### Rate Limiting

- **Cooldown period**: 60 seconds between API validation calls
- **Scope**: Per-process isolation using `$$` (process ID)
- **Bypass**: Format validation continues even during cooldown
- **Purpose**: Prevents accidental quota exhaustion during development/testing

### Connection Security

- **Timeout limits**: 5-second connection, 10-second total timeout
- **Headers**: Proper HTTP-Referer and X-Title identification
- **Error isolation**: Network errors don't fail the entire validation

### Data Protection

- **No key logging**: API keys are never written to logs or temporary files
- **Minimal requests**: Uses smallest possible payload (1 token max)
- **Quick cleanup**: Temporary files removed immediately after use

## Error Messages and Troubleshooting

### Missing API Key

```text
OpenRouter API key is missing. Please set OPENROUTER_API_KEY environment variable.
Setup instructions:
  1. Create account at https://openrouter.ai
  2. Generate API key from dashboard
  3. Add as repository secret: Settings → Secrets → Actions → OPENROUTER_API_KEY
```

### Invalid Format

```text
OpenRouter API key format is invalid. Expected format: sk-or-{32+ characters}
Valid characters: letters, numbers, underscores, and dashes
Example: sk-or-v1_abcd1234efgh5678ijkl9012mnop3456qrst
Check your key at: https://openrouter.ai/keys
```

### Authentication Failure

```text
OpenRouter API key is invalid or expired
Please check your key at: https://openrouter.ai/keys
Ensure the key has sufficient credits and permissions
```

### Rate Limiting

```text
Rate limiting API validation (wait 45s to avoid quota exhaustion)
OpenRouter API key format is valid (skipping live validation due to rate limit)
```

## Test Coverage

The validation includes comprehensive test cases covering:

### Valid Formats (8 test cases)

- Minimum length (36 characters)
- Typical length (40 characters)
- Extended length (50+ characters)
- Keys with underscores, dashes, mixed case
- Numeric and alphabetic only keys

### Invalid Formats (12 test cases)

- Wrong prefixes (`sk-`, `api-key-`)
- Too short (under 32 characters after prefix)
- Empty strings and prefix-only keys
- Invalid characters (spaces, special symbols)
- Case sensitivity issues
- Malformed prefixes

### Test Execution

```bash
bash scripts/tests/test-openrouter-validation.sh
```

## Integration Points

### GitHub Actions Workflows

- Called during prerequisite validation in all AI workflows
- Provides early failure detection before expensive AI operations
- Supports CI/CD environment variables and secret access

### Local Development

- Validates developer environment setup
- Provides actionable error messages for local troubleshooting
- Supports manual testing and verification

### Error Recovery

- Format errors: Immediate failure with clear instructions
- Network errors: Warnings with manual verification suggestions
- Rate limiting: Graceful degradation with format-only validation

## Best Practices

1. **Set up rate limiting** in development environments to avoid quota exhaustion
2. **Use repository secrets** for CI/CD rather than environment variables
3. **Monitor key expiration** and rotation policies
4. **Test key validity** manually using OpenRouter playground when in doubt
5. **Check credit balance** if authentication succeeds but requests fail later

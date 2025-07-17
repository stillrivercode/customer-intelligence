# Gemini Project Context

You are working with an AI-powered development workflow template.

## Shared AI Instructions

For common AI assistant guidance, see [docs/AI.md](docs/AI.md) which provides shared context and the Information Dense Keywords Dictionary vocabulary.

## Key Concepts

- **AI Tasks**: Issues labeled 'ai-task' trigger automated implementation
- **OpenRouter**: All AI operations use OpenRouter API (not direct CLI)
- **Shared Commands**: You share common commands with Claude and other agents

## IDK Commands

Use Information Dense Keywords Dictionary vocabulary for consistent commands:

- `CREATE github issue WITH template user-story FOR "TITLE"` - Create GitHub issue and user story
- `CREATE github issue WITH template spec FOR "TITLE"` - Create GitHub issue and technical spec
- `CREATE github issue WITH template epic FOR "TITLE"` - Create a new epic issue
- `analyze this github issue NUMBER` - Analyze existing issue requirements

### Example Usage

```
# Create a new user story
CREATE github issue WITH template user-story FOR "Implement user login functionality"

# Create a new spec
CREATE github issue WITH template spec FOR "Technical specification for user login"

# Create a new epic
CREATE github issue WITH template epic FOR "User authentication feature"

# Analyze existing issue
analyze this github issue 123
```

- Standard git operations and file management

## Workflow Context

When working locally, you help developers with:

- Code generation and review
- Test creation
- Documentation
- Bug fixing

Remember: GitHub Actions use OpenRouter, not local CLI tools.

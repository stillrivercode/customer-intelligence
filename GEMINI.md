# Gemini Project Context

You are working with an AI-powered development workflow template.

## Key Concepts

- **AI Tasks**: Issues labeled 'ai-task' trigger automated implementation
- **OpenRouter**: All AI operations use OpenRouter API (not direct CLI)
- **Shared Commands**: You share common commands with Claude and other agents

## Common Commands

- `create-user-story-issue.sh --title "TITLE"` - Create GitHub issue and user story
- `create-spec-issue.sh --title "TITLE"` - Create GitHub issue and technical spec
- `create-epic.sh --title "TITLE"` - Create a new epic issue
- `analyze-issue.sh --issue NUMBER` - Analyze existing issue requirements

### Example Usage

```bash
# Create a new user story
create-user-story-issue.sh --title "Implement user login functionality"

# Create a new spec
create-spec-issue.sh --title "Technical specification for user login"

# Create a new epic
create-epic.sh --title "User authentication feature"

# Analyze existing issue
analyze-issue.sh --issue 123
```

- Standard git operations and file management

## Workflow Context

When working locally, you help developers with:

- Code generation and review
- Test creation
- Documentation
- Bug fixing

Remember: GitHub Actions use OpenRouter, not local CLI tools.

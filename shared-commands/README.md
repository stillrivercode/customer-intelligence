# Shared Commands

This directory contains commands that can be shared between different AI assistants (Claude, Gemini, etc.)
to provide consistent functionality across the project.

## Prerequisites

Before using these commands, you must have the following software installed on your system:

- **GitHub CLI (`gh`)**: For interacting with the GitHub API.
- **jq**: For processing JSON data.

## Installation

You can install the shared commands using npm:

```bash
npm install -g @stillrivercode/shared-commands
```

Or you can use them directly with npx:

```bash
npx @stillrivercode/shared-commands <command> [options]
```

## Usage

### Available Commands

1. **`add-spec-comment`**: Add a comment to a spec file.
2. **`add-user-story-comment`**: Add a comment to a user story file.
3. **`analyze-issue`**: Analyzes existing GitHub issues for requirements and scope.
4. **`create-epic`**: Creates a new "Epic" issue for a feature from the roadmap.
5. **`create-spec-issue`**: Creates GitHub issue and detailed technical specifications in unified workflow.
6. **`create-user-story-issue`**: Creates GitHub issue and comprehensive user story documentation in unified workflow.

### Example

```bash
# Create a new user story
npx @stillrivercode/shared-commands create-user-story-issue --title "Implement user login"
```

## Development

To work on the shared commands, you can clone this repository and then run the commands directly from the
`shared-commands` directory:

```bash
./commands/create-user-story-issue.sh --title "Implement user login"
```

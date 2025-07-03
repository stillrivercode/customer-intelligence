# AI Workflow Template

A CLI tool to create AI-powered GitHub workflow automation projects. Get AI-assisted development up and running in your
GitHub repository in minutes.

## 🚀 Quick Start

### Install via npm

```bash
# Install globally
npm install -g @stillrivercode/customer-intelligence

# Create a new project
customer-intelligence my-ai-project
cd my-ai-project

# Run the local install script
./install.sh
```

### Or use npx (no installation required)

```bash
# Create project directly
npx @stillrivercode/customer-intelligence my-ai-project
cd my-ai-project

# Run the local install script
./install.sh
```

## 🎯 What You Get

✅ **GitHub Actions workflows** for AI task automation
✅ **Issue templates** for requesting AI assistance
✅ **Pre-configured labels** and automation
✅ **Cost monitoring** and usage optimization
✅ **Security scanning** and quality gates
✅ **Complete documentation** for your team

## 🛠️ Setup Process

After running the init command, you'll have a complete project with:

1. **AI-powered GitHub workflows** that respond to labeled issues
2. **Issue templates** for different types of AI tasks
3. **Automated quality checks** (linting, security, tests)
4. **Cost controls** and monitoring
5. **Documentation** tailored to your project

### Manual Configuration Required

The template creates all necessary files but **does not automatically configure secrets**. You'll need to set up:

#### 1. Environment Variables (Optional for Local Development)

Copy the provided template and configure your local environment:

```bash
# Copy template to create your local environment file
cp .env.example .env

# Edit .env with your actual values
# OPENROUTER_API_KEY=sk-or-your-actual-key-here
```

#### 2. GitHub Repository Secrets (Required for CI/CD)

Add these secrets to your GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

```bash
# Required: OpenRouter API key for AI functionality
gh secret set OPENROUTER_API_KEY --body "sk-or-your-actual-key-here"

# Optional: GitHub Personal Access Token (only for cross-workflow triggering)
gh secret set GH_PAT --body "your-github-token-here"
```

**Get your OpenRouter API key**: [openrouter.ai](https://openrouter.ai)

#### 3. Repository Labels

Set up the required labels for AI workflow automation:

```bash
# Run the label setup script (included in your project)
./scripts/setup-labels.sh
```

### GitHub Token Permissions

This project's scripts and workflows use the `GITHUB_TOKEN` to interact with the GitHub API. The token's permissions are
automatically configured in GitHub Actions environments. For local development, you may need to create a personal access
token with the appropriate scopes.

For more information on GitHub token permissions, see the official documentation:

- [Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [Troubleshooting your authentication credentials](https://docs.github.com/en/authentication/troubleshooting-your-authentication-credentials)
- [Authenticating as a GitHub App installation](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation)

## 📋 How It Works

1. **Create Issue**: Add `ai-task` label to any GitHub issue
2. **AI Processing**: GitHub Action automatically implements the solution
3. **Pull Request**: AI creates PR with code, tests, and documentation
4. **Review & Merge**: Your team reviews and merges AI-generated code

### Example Workflow

```bash
# 1. Create an issue requesting a feature
gh issue create --title "Add user authentication" --label "ai-task"

# 2. AI automatically:
#    - Creates feature branch
#    - Implements the code
#    - Adds tests
#    - Creates pull request

# 3. Review and merge the PR
gh pr review --approve
gh pr merge
```

## 🏷️ Available Labels

The setup creates these labels for different AI workflows:

- `ai-task` - General AI development tasks
- `ai-bug-fix` - AI-assisted bug fixes
- `ai-refactor` - Code refactoring requests
- `ai-test` - Test generation
- `ai-docs` - Documentation updates
- `ai-fix-lint` - Automatic lint fixes
- `ai-fix-security` - Security issue fixes
- `ai-fix-tests` - Test failure fixes

## 📚 Documentation

After setup, your project includes:

- **Getting Started Guide** - Team onboarding
- **AI Workflow Guide** - How to use AI assistance
- **Security Guidelines** - Safe AI development practices
- **Troubleshooting** - Common issues and solutions

## 🔒 Security Features

- **Automated security scanning** with Bandit and Semgrep
- **Dependency vulnerability checks**
- **Secret detection** and prevention
- **AI-powered security fixes** for detected issues
- **Cost controls** to prevent runaway API usage

## 🧹 Code Quality & Security

This project uses a suite of npm-based tools to ensure code quality, consistency,
and security. The tools are configured to run in pre-commit hooks and in CI/CD workflows.

### Linting & Formatting

- **ESLint**: For identifying and reporting on patterns in JavaScript.
  - `.eslintrc.js`: Base configuration.
  - `.eslintrc.security.js`: Stricter rules for security.
- **Prettier**: For consistent code formatting.
- **markdownlint**: For ensuring Markdown files are well-formed.
- **yamllint**: For validating YAML files.

### Available npm scripts

- `npm run lint`: Lints the codebase.
- `npm run lint:fix`: Fixes linting errors automatically.
- `npm run lint:cached`: Lints only changed files.
- `npm run lint:security`: Runs a security-focused lint scan.
- `npm run lint:all`: Runs all linting and formatting checks in parallel.
- `npm run format`: Formats the codebase with Prettier.
- `npm run format:check`: Checks for formatting issues.

### Pre-commit Hooks

The `./install.sh` script automatically sets up pre-commit hooks to run these checks
before each commit. See `.pre-commit-config.yaml` for the full configuration.

## ⚡ CLI Commands

```bash
# Create new project
customer-intelligence <project-name>

# Get help
customer-intelligence --help

# Check version
customer-intelligence --version
```

### CLI Options

```bash
# Basic setup
customer-intelligence my-project

# Force overwrite existing directory
customer-intelligence my-project --force

# Use specific template
customer-intelligence my-project --template enterprise

# Initialize git repository
customer-intelligence my-project --git-init
```

### Install Script Options

```bash
# Non-interactive installation
./install.sh --auto-yes

# Development installation
./install.sh --dev

# Skip specific components
./install.sh --skip-labels --skip-claude
```

## 🆘 Support & Troubleshooting

### Common Issues

| Issue                    | Solution                                             |
| ------------------------ | ---------------------------------------------------- |
| API key not working      | Verify key at [openrouter.ai](https://openrouter.ai) |
| Workflows not triggering | Check repository secrets are set                     |
| AI tasks failing         | Review workflow logs in GitHub Actions               |
| Permission errors        | Check GitHub Actions permissions                     |

### Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/stillrivercode/customer-intelligence/issues)
- **Documentation**: Check the generated docs in your project
- **Examples**: See working examples in the template repository

## 🔄 Updates

Keep your AI workflows up to date:

```bash
# Check for updates
npm update @stillrivercode/customer-intelligence

# Update your project workflows (manual sync with template)
git fetch template
git log --oneline template/main ^HEAD
```

## 📄 License

MIT License - free for personal and commercial use.

> **Note**: This project is currently in active development and not yet ready for external contributions.
> We appreciate your interest and will update this section when we're ready to accept contributions.

---

**Ready to supercharge your development with AI?**

```bash
npx @stillrivercode/customer-intelligence my-ai-project
```

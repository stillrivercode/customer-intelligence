#!/bin/bash

# Agentic Workflow Template Installation Script
# This script sets up the complete AI workflow automation environment
# Usage: ./install.sh [--dev] [--skip-labels] [--auto-yes] [--openrouter-key KEY] [--gh-pat TOKEN]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DEV=false
SKIP_LABELS=false
AUTO_YES=false
OPENROUTER_KEY=""
REPO_NAME=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            INSTALL_DEV=true
            shift
            ;;
        --skip-labels)
            SKIP_LABELS=true
            shift
            ;;
        --auto-yes)
            AUTO_YES=true
            shift
            ;;
        --openrouter-key)
            OPENROUTER_KEY="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --dev               Install development dependencies"
            echo "  --skip-labels       Skip GitHub labels setup"
            echo "  --auto-yes          Automatically answer yes to prompts (non-interactive)"
            echo "  --openrouter-key KEY Set OpenRouter API key automatically"
            echo "  -h, --help          Show this help message"
            echo ""
            echo "Environment Variables (more secure than command-line):"
            echo "  OPENROUTER_API_KEY  OpenRouter API key (alternative to --openrouter-key)"
            echo ""
            echo "Example:"
            echo "  export OPENROUTER_API_KEY=sk-..."
            echo "  ./install.sh --auto-yes"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

prompt_user() {
    local message="$1"
    local default="${2:-y}"

    if [[ "$AUTO_YES" == true ]]; then
        echo -e "${BLUE}?${NC} $message ${YELLOW}[auto-yes]${NC}"
        return 0
    fi

    echo -n -e "${BLUE}?${NC} $message [y/N]: "
    # Add timeout of 60 seconds for user input
    if read -t 60 -r response; then
        case "$response" in
            [yY][eE][sS]|[yY])
                return 0
                ;;
            *)
                return 1
                ;;
        esac
    else
        log_warning "Timeout waiting for user input (60s). Assuming 'No'."
        return 1
    fi
}

check_python_version() {
    if check_command python3; then
        local version=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+')
        local major=$(echo $version | cut -d. -f1)
        local minor=$(echo $version | cut -d. -f2)

        if [[ $major -eq 3 && $minor -ge 12 ]]; then
            return 0
        fi
    fi
    return 1
}

create_venv() {
    log_info "Creating Python virtual environment..."

    if [[ -d "venv" ]]; then
        if prompt_user "Virtual environment already exists. Recreate it?"; then
            log_info "Removing existing virtual environment..."
            rm -rf venv
        else
            log_warning "Using existing virtual environment"
            return 0
        fi
    fi

    python3 -m venv venv
    log_success "Virtual environment created"
}

activate_venv() {
    log_info "Activating virtual environment..."

    if [[ -f "venv/bin/activate" ]]; then
        source venv/bin/activate
        log_success "Virtual environment activated"
    else
        log_error "Virtual environment not found"
        return 1
    fi
}

install_node_deps() {
    log_info "Installing Node.js dependencies..."

    if check_command npm; then
        # Check for package-lock.json to ensure consistent dependencies
        if [[ -f "package-lock.json" ]]; then
            log_info "Found package-lock.json, using npm ci for faster, consistent install"
            if [[ "$INSTALL_DEV" == true ]]; then
                npm ci --include=dev
            else
                npm ci --production
            fi
        else
            log_warning "No package-lock.json found, using npm install"
            if [[ "$INSTALL_DEV" == true ]]; then
                npm install --include=dev
            else
                npm install --production
            fi
        fi

        # Run security audit
        log_info "Running security audit..."
        npm audit || log_warning "Some vulnerabilities found. Run 'npm audit fix' to address them."

        log_success "Dependencies installed"
    else
        log_error "npm not found. Please install Node.js and npm"
        return 1
    fi
}

validate_precommit_config() {
    log_info "Validating pre-commit configuration..."

    # Check if .pre-commit-config.yaml exists
    if [[ ! -f ".pre-commit-config.yaml" ]]; then
        log_error "Pre-commit configuration file not found: .pre-commit-config.yaml"
        return 1
    fi

    # Validate YAML syntax if python3 is available
    if check_command python3; then
        if ! python3 -c "
import yaml
try:
    with open('.pre-commit-config.yaml', 'r') as f:
        config = yaml.safe_load(f)
    print('✓ Pre-commit configuration is valid YAML')
except yaml.YAMLError as e:
    print(f'✗ Invalid YAML syntax: {e}')
    exit(1)
except Exception as e:
    print(f'✗ Error reading config: {e}')
    exit(1)
        " 2>/dev/null; then
            log_success "Pre-commit configuration validated"
        else
            log_error "Pre-commit configuration has invalid YAML syntax"
            return 1
        fi
    else
        log_warning "Python3 not available, skipping YAML validation"
    fi

    return 0
}

setup_precommit() {
    if [[ "$INSTALL_DEV" == true ]]; then
        log_info "Setting up pre-commit hooks..."

        # Validate configuration first
        if ! validate_precommit_config; then
            log_error "Pre-commit configuration validation failed"
            return 1
        fi

        if check_command pre-commit; then
            # Check pre-commit version
            local version=$(pre-commit --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
            log_info "Using pre-commit version: $version"

            # Install hooks
            if pre-commit install --install-hooks; then
                log_success "Pre-commit hooks installed successfully"

                # Optional: Run a quick test
                if prompt_user "Run pre-commit on all files to test installation?"; then
                    log_info "Running pre-commit on all files..."
                    if pre-commit run --all-files; then
                        log_success "Pre-commit test passed"
                    else
                        log_warning "Pre-commit found issues (normal for first run)"
                        log_info "You can fix issues later with: pre-commit run --all-files"
                    fi
                fi
            else
                log_error "Failed to install pre-commit hooks"
                return 1
            fi
        else
            log_warning "pre-commit not available, skipping hook setup"
            log_info "Install pre-commit with: pip install pre-commit>=2.15.0"
        fi
    fi
}

setup_openrouter_api() {
    log_info "Configuring OpenRouter API (replaces Claude CLI)..."

    echo ""
    echo -e "${BLUE}ℹ️  OpenRouter API Configuration${NC}"
    echo "This repository now uses OpenRouter API for AI functionality."
    echo "No CLI installation is required."
    echo ""
    echo "Setup requirements:"
    echo "1. OpenRouter API key (set OPENROUTER_API_KEY secret)"
    echo "2. Optional: AI model selection (set AI_MODEL variable)"
    echo ""
    echo "Benefits:"
    echo "• Faster execution (no CLI installation delays)"
    echo "• Multi-model support"
    echo "• Direct API integration"
    echo ""

    if [[ -n "$OPENROUTER_KEY" ]]; then
        log_info "OpenRouter API key provided via command line"
        echo "Remember to add this key as a repository secret: OPENROUTER_API_KEY"
    else
        log_info "OpenRouter API key not provided - you'll need to set it as a repository secret"
    fi
}

setup_github_labels() {
    if [[ "$SKIP_LABELS" == true ]]; then
        log_info "Skipping GitHub labels setup (--skip-labels)"
        return 0
    fi

    log_info "Setting up GitHub labels..."

    if ! check_command gh; then
        log_warning "GitHub CLI not found, skipping labels setup"
        log_info "Install GitHub CLI: https://cli.github.com/"
        return 0
    fi

    # Check if we're in a Git repository
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        log_warning "Not in a Git repository, skipping labels setup"
        return 0
    fi

    # Check if we have a remote repository
    if ! git remote get-url origin >/dev/null 2>&1; then
        log_warning "No Git remote found, skipping labels setup"
        return 0
    fi

    if [[ -f "scripts/setup-labels.sh" ]]; then
        chmod +x scripts/setup-labels.sh
        ./scripts/setup-labels.sh
    else
        log_warning "Labels setup script not found"
    fi
}

setup_shared_commands() {
    log_info "Setting up shared commands for AI assistants..."

    if [[ -f "shared-commands/setup.sh" ]]; then
        chmod +x shared-commands/setup.sh
        # Run setup with auto-yes flag to skip interactive prompts
        if [[ "$AUTO_YES" == true ]]; then
            # Use a cross-platform approach to prevent hanging
            log_info "Auto-answering symlink prompt with 'no'"

            # Try to run with timeout (if available), otherwise use a simple approach
            local setup_success=false
            if command -v timeout >/dev/null 2>&1; then
                # GNU timeout available (Linux)
                if timeout 30 bash -c 'printf "n\n" | ./shared-commands/setup.sh' 2>&1; then
                    setup_success=true
                fi
            elif command -v gtimeout >/dev/null 2>&1; then
                # GNU timeout via brew on macOS
                if gtimeout 30 bash -c 'printf "n\n" | ./shared-commands/setup.sh' 2>&1; then
                    setup_success=true
                fi
            else
                # Fallback: use background process with kill
                (printf "n\n" | ./shared-commands/setup.sh) &
                local setup_pid=$!
                local count=0
                while kill -0 "$setup_pid" 2>/dev/null && [[ $count -lt 30 ]]; do
                    sleep 1
                    ((count++))
                done
                if kill -0 "$setup_pid" 2>/dev/null; then
                    kill "$setup_pid" 2>/dev/null
                    wait "$setup_pid" 2>/dev/null
                    log_warning "Setup script exceeded 30 seconds, terminated"
                else
                    wait "$setup_pid"
                    if [[ $? -eq 0 ]]; then
                        setup_success=true
                    fi
                fi
            fi

            if [[ "$setup_success" == true ]]; then
                log_success "Shared commands setup completed with auto-response"
            else
                log_warning "Setup script failed or timed out, applying fallback"
                # Fallback: just make commands executable and skip symlinks
                if [[ -d "shared-commands/commands" ]]; then
                    find shared-commands/commands -name "*.sh" -type f -exec chmod +x {} \;
                    log_success "Made command scripts executable"
                else
                    log_warning "Commands directory not found: shared-commands/commands"
                fi
            fi
        else
            REPLY="n" ./shared-commands/setup.sh
        fi
        log_success "Shared commands setup completed"
    else
        log_warning "Shared commands setup script not found"
    fi
}

setup_template_upstream() {
    log_info "Setting up template upstream remote..."

    # Check if we're in a git repository (already checked earlier, but being safe)
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        log_warning "Not in a git repository, skipping upstream setup"
        return 0
    fi

    local template_url="https://github.com/stillrivercode/agentic-workflow-template.git"
    local upstream_name="template"

    # Check if upstream remote already exists
    if git remote get-url "$upstream_name" >/dev/null 2>&1; then
        local existing_url=$(git remote get-url "$upstream_name")
        if [ "$existing_url" = "$template_url" ]; then
            log_success "Template upstream remote already configured correctly"
        else
            log_warning "Upstream remote '$upstream_name' exists but points to different URL"
            log_info "Current: $existing_url"
            log_info "Expected: $template_url"
            log_info "You can update it later with: git remote set-url $upstream_name $template_url"
        fi
    else
        git remote add "$upstream_name" "$template_url"
        log_success "Added template upstream remote"
    fi

    # Fetch latest changes from template
    log_info "Fetching latest template changes..."
    if git fetch "$upstream_name" >/dev/null 2>&1; then
        log_success "Template changes fetched"
    else
        log_warning "Could not fetch template changes (network issue?)"
    fi
}

setup_github_secrets() {
    log_info "Setting up GitHub repository secrets..."

    if ! check_command gh; then
        log_warning "GitHub CLI not found, cannot set secrets"
        return 0
    fi

    if ! git remote get-url origin >/dev/null 2>&1; then
        log_warning "No Git remote found, skipping secrets setup"
        return 0
    fi

    # Check environment variables if not provided via command line
    if [[ -z "$OPENROUTER_KEY" && -n "${OPENROUTER_API_KEY:-}" ]]; then
        log_info "Using OPENROUTER_API_KEY from environment"
        OPENROUTER_KEY="$OPENROUTER_API_KEY"
    fi

    # Set secrets if provided via parameters
    local secrets_set=false

    if [[ -n "$OPENROUTER_KEY" ]]; then
        log_info "Setting OPENROUTER_API_KEY from parameter..."
        # Basic validation for OpenRouter API key format
        if [[ ! "$OPENROUTER_KEY" =~ ^sk-[A-Za-z0-9_-]{32,}$ ]]; then
            log_warning "API key format may be invalid. OpenRouter keys typically start with 'sk-'"
        fi
        if echo "$OPENROUTER_KEY" | gh secret set OPENROUTER_API_KEY; then
            log_success "OPENROUTER_API_KEY secret set"
            secrets_set=true
        else
            log_error "Failed to set OPENROUTER_API_KEY secret"
        fi
    fi

    # Check existing secrets
    local secrets_missing=false

    if gh secret list | grep -q "OPENROUTER_API_KEY"; then
        log_success "OPENROUTER_API_KEY secret found"
    else
        log_warning "OPENROUTER_API_KEY secret not found"
        secrets_missing=true
    fi

    # Offer to set secrets interactively if missing and not provided
    if [[ "$secrets_missing" == true && "$secrets_set" == false ]]; then
        echo ""
        if prompt_user "Would you like to set up GitHub secrets now?"; then
            if [[ -z "$OPENROUTER_KEY" ]] && ! gh secret list | grep -q "OPENROUTER_API_KEY"; then
                echo "Enter your OpenRouter API key (get one at https://openrouter.ai):"
                read -r -s openrouter_key
                if [[ -n "$openrouter_key" ]]; then
                    if echo "$openrouter_key" | gh secret set OPENROUTER_API_KEY; then
                        log_success "OPENROUTER_API_KEY secret set"
                    else
                        log_error "Failed to set OPENROUTER_API_KEY secret"
                    fi
                fi
            fi
        else
            echo ""
            echo "Manual setup instructions:"
            echo "1. Get OpenRouter API key: https://openrouter.ai"
            echo "2. Set secret:"
            echo "   gh secret set OPENROUTER_API_KEY"
            echo "3. Or via GitHub web interface: Settings > Secrets and variables > Actions"
            echo ""
        fi
    fi
}

verify_installation() {
    log_info "Verifying installation..."

    # Check Node.js environment
    if [[ -f "package.json" ]]; then
        if check_command npm; then
            log_success "Node.js environment verified"
        else
            log_error "npm not found but package.json exists"
        fi
    fi

    # Check if npm dependencies are installed
    if [[ -d "node_modules" ]]; then
        log_success "Node.js dependencies installed"
    else
        log_warning "node_modules directory not found"
    fi

    # Check if scripts are executable
    if [[ -x "scripts/setup-labels.sh" ]]; then
        log_success "Scripts are executable"
    else
        log_warning "Some scripts may need chmod +x"
    fi
}

print_next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Installation completed!${NC}"
    echo ""
    echo "Next steps:"

    echo "1. Verify OpenRouter API key is set as repository secret"

    # Check for missing secrets
    local missing_secrets=""
    if ! gh secret list | grep -q "OPENROUTER_API_KEY" 2>/dev/null; then
        missing_secrets="OPENROUTER_API_KEY " # pragma: allowlist secret
    fi

    if [[ -n "$missing_secrets" ]]; then
        echo "2. Set up repository secret: gh secret set ${missing_secrets% }"
    fi

    echo "3. Create your first AI task issue on GitHub"
    echo "4. Review the documentation: docs/simplified-architecture.md"
    echo ""
    echo "Shared Commands for AI Assistants:"
    echo "- Create user story: ./shared-commands/commands/create-user-story-issue.sh --title \"Feature Name\""
    echo "- Create tech spec: ./shared-commands/commands/create-spec-issue.sh --title \"Feature Architecture\""
    echo "- Analyze issue: ./shared-commands/commands/analyze-issue.sh --issue NUMBER"
    echo ""
    echo "For development:"
    echo "- Run tests: npm test"
    echo "- Run linting: npm run lint"
    echo ""
    echo "Template updates:"
    echo "- Check for updates: git log --oneline template/main ^HEAD"
    echo "- Update scripts: ./dev-scripts/update-from-template.sh"
    echo ""
    echo "Non-interactive installation:"
    echo "- ./install.sh --auto-yes --openrouter-key YOUR_KEY"
    echo "- Or more securely with environment variables:"
    echo "  export OPENROUTER_API_KEY=sk-..."
    echo "  ./install.sh --auto-yes"
    echo ""
}

main() {
    echo -e "${BLUE}🤖 Agentic Workflow Template Installer${NC}"
    echo "Setting up AI-powered development workflow automation..."
    echo ""

    # Security warning for command-line secrets
    if [[ -n "$OPENROUTER_KEY" ]]; then
        log_warning "Passing secrets via command line may expose them in shell history"
        log_info "Consider using environment variables instead: export OPENROUTER_API_KEY=..."
        echo ""
    fi

    # Prerequisites check
    log_info "Checking prerequisites..."

    if ! check_command node; then
        log_error "Node.js is required"
        log_info "Install Node.js: https://nodejs.org/"
        exit 1
    fi
    log_success "Node.js found"

    if ! check_command npm; then
        log_error "npm is required"
        log_info "npm should come with Node.js installation"
        exit 1
    fi
    log_success "npm found"

    if ! check_command git; then
        log_error "Git is required"
        exit 1
    fi
    log_success "Git found"

    # Main installation steps
    install_node_deps
    setup_precommit
    setup_openrouter_api
    setup_github_labels
    setup_shared_commands
    setup_template_upstream
    setup_github_secrets
    verify_installation
    print_next_steps
}

# Run main function
main "$@"

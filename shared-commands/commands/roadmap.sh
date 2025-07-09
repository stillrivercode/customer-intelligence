#!/bin/bash

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../" && pwd)"
source "$SCRIPT_DIR/../lib/common-utils.sh"

COMMAND_NAME="roadmap"
DESCRIPTION="Displays the latest project roadmap or generates a new one."

# Function to generate a slug from title or goals
generate_slug() {
    local text="$1"
    echo "$text" | \
        tr '[:upper:]' '[:lower:]' | \
        sed 's/[^a-zA-Z0-9 ,.-]//g' | \
        sed 's/[, ][, ]*/-/g' | \
        sed 's/^-\+\|-\+$//g' | \
        cut -c1-50
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --generate)
            GENERATE="true"
            shift
            ;;
        --input)
            INPUT="$2"
            shift 2
            ;;
        --title)
            TITLE="$2"
            shift 2
            ;;
        --output)
            OUTPUT="$2"
            shift 2
            ;;
        --help|-h)
            HELP="true"
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Show help if requested
if [[ "$HELP" == "true" ]]; then
    echo "Usage: $COMMAND_NAME [--generate --input \"GOALS\" [--title \"TITLE\"]]"
    echo
    echo "$DESCRIPTION"
    echo
    echo "Options:"
    echo "  --generate    Generate a new roadmap."
    echo "  --input       Comma-separated list of goals for the new roadmap."
    echo "  --title       (Optional) Title for the roadmap. If not provided, generates from goals."
    echo "  --output      (Optional) Output file for the new roadmap."
    echo "                If not specified, generates filename from title/goals."
    echo "  --help, -h    Show this help message."
    exit 0
fi

# Main execution
if [[ "$GENERATE" == "true" ]]; then
    # --- Generate Mode ---
    if [[ -z "$INPUT" ]]; then
        log_error "--input is required for --generate"
        exit 1
    fi

    template_path="$SCRIPT_DIR/../lib/templates/roadmap-template.md"
    if [[ ! -f "$template_path" ]]; then
        log_error "Roadmap template not found at $template_path"
        exit 1
    fi

    year=$(date "+%Y")
    quarter=$(( ($(date "+%m") - 1) / 3 + 1 ))
    objective="High-level goals for this quarter."

    IFS=',' read -ra goals <<< "$INPUT"
    phase1_features=""
    phase2_features=""
    phase3_features=""
    i=0
    for goal in "${goals[@]}"; do
        if (( i % 3 == 0 )); then
            phase1_features+="- **Feature:** $goal\n"
        elif (( i % 3 == 1 )); then
            phase2_features+="- **Feature:** $goal\n"
        else
            phase3_features+="- **Feature:** $goal\n"
        fi
        i=$((i+1))
    done

    output_dir="$PROJECT_ROOT/dev-docs/roadmaps"
    ensure_directory "$output_dir"

    # Generate filename from title or goals
    if [[ -n "$OUTPUT" ]]; then
        output_file="$OUTPUT"
    else
        # Use title if provided, otherwise generate from goals
        if [[ -n "$TITLE" ]]; then
            slug=$(generate_slug "$TITLE")
        else
            # Generate title from first 2-3 goals
            IFS=',' read -ra goals_array <<< "$INPUT"
            # Trim leading/trailing spaces from each goal
            title_text="${goals_array[0]#"${goals_array[0]%%[![:space:]]*}"}"
            title_text="${title_text%"${title_text##*[![:space:]]}"}"
            if [[ ${#goals_array[@]} -gt 1 ]]; then
                goal2="${goals_array[1]#"${goals_array[1]%%[![:space:]]*}"}"
                goal2="${goal2%"${goal2##*[![:space:]]}"}"
                title_text="$title_text $goal2"
            fi
            slug=$(generate_slug "$title_text")
        fi

        base_name="roadmap-$slug"
        output_file="$output_dir/${base_name}.md"

        # If file exists, add a counter to make it unique
        counter=1
        while [[ -f "$output_file" ]]; do
            output_file="$output_dir/${base_name}-${counter}.md"
            ((counter++))
        done
    fi

    log_info "Generating new roadmap at $output_file..."

    sed -e "s/{{YEAR}}/$year/g" \
        -e "s/{{QUARTER}}/$quarter/g" \
        -e "s/{{OBJECTIVE}}/$(escape_sed "$objective")/g" \
        -e "s/{{PHASE_1_NAME}}/Initial Phase/g" \
        -e "s/{{PHASE_1_GOAL}}/Address primary goals./g" \
        -e "s/.*{{FEATURE_1A}}.*/$(escape_sed "$phase1_features")/g" \
        -e "s/{{PHASE_2_NAME}}/Secondary Phase/g" \
        -e "s/{{PHASE_2_GOAL}}/Address secondary goals./g" \
        -e "s/.*{{FEATURE_2A}}.*/$(escape_sed "$phase2_features")/g" \
        -e "s/{{PHASE_3_NAME}}/Final Phase/g" \
        -e "s/{{PHASE_3_GOAL}}/Address final goals./g" \
        -e "s/.*{{FEATURE_3A}}.*/$(escape_sed "$phase3_features")/g" \
        -e "/{{FEATURE.*}}/d" \
        "$template_path" > "$output_file"

    log_success "New roadmap generated: $output_file"

else
    # --- Display Mode ---
    roadmap_dir="$PROJECT_ROOT/dev-docs/roadmaps"
    latest_roadmap=$(ls -1 "$roadmap_dir"/roadmap-*.md 2>/dev/null | sort -V | tail -n 1)

    if [[ -z "$latest_roadmap" ]]; then
        log_error "No roadmaps found in $roadmap_dir"
        exit 1
    fi

    log_info "Displaying latest roadmap: $latest_roadmap"
    echo
    cat "$latest_roadmap"
fi

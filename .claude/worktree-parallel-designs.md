# Git Worktree Management for Parallel Design Development

## Overview
This utility helps manage multiple git worktrees for parallel frontend mockup designs. Perfect for exploring different design variations simultaneously without branch switching overhead.

## Quick Start Commands

### Setup 5 Parallel Design Worktrees
```bash
#!/bin/bash
# setup-design-worktrees.sh

# Configuration
DESIGN_COUNT=5
BASE_DIR="../"
BRANCH_PREFIX="design"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up $DESIGN_COUNT parallel design worktrees...${NC}"

# Create worktrees
for i in $(seq 1 $DESIGN_COUNT); do
    WORKTREE_DIR="${BASE_DIR}frontend-design-${i}"
    BRANCH_NAME="${BRANCH_PREFIX}-${i}"
    
    echo -e "${GREEN}Creating worktree: $WORKTREE_DIR (branch: $BRANCH_NAME)${NC}"
    git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME"
    
    # Optional: Create a design-specific README
    echo "# Design Variant $i" > "$WORKTREE_DIR/DESIGN_NOTES.md"
    echo "Created: $(date)" >> "$WORKTREE_DIR/DESIGN_NOTES.md"
done

echo -e "${BLUE}✅ Created $DESIGN_COUNT worktrees successfully!${NC}"
git worktree list
```

### List All Worktrees
```bash
# list-worktrees.sh
git worktree list --porcelain | while read -r line; do
    if [[ $line == worktree* ]]; then
        echo "📁 ${line#worktree }"
    elif [[ $line == branch* ]]; then
        echo "   └─ ${line}"
        echo ""
    fi
done
```

### Switch Between Worktrees
```bash
# switch-worktree.sh
# Usage: ./switch-worktree.sh <number>

DESIGN_NUM=${1:-1}
WORKTREE_DIR="../frontend-design-${DESIGN_NUM}"

if [ -d "$WORKTREE_DIR" ]; then
    cd "$WORKTREE_DIR"
    echo "Switched to Design $DESIGN_NUM"
    pwd
else
    echo "Worktree $WORKTREE_DIR does not exist"
    echo "Available worktrees:"
    git worktree list
fi
```

## Advanced Operations

### Create Custom Named Worktree
```bash
# create-named-worktree.sh
# Usage: ./create-named-worktree.sh <name> <description>

NAME=${1:-"experimental"}
DESC=${2:-"Experimental design"}
BRANCH="design-$NAME"
DIR="../frontend-$NAME"

git worktree add "$DIR" -b "$BRANCH"
echo "# $DESC" > "$DIR/DESIGN_NOTES.md"
echo "Branch: $BRANCH" >> "$DIR/DESIGN_NOTES.md"
echo "Created: $(date)" >> "$DIR/DESIGN_NOTES.md"
```

### Compare Designs Across Worktrees
```bash
# compare-designs.sh
# Shows differences between design worktrees

echo "Design Comparison Summary"
echo "========================="

for dir in ../frontend-design-*; do
    if [ -d "$dir" ]; then
        echo ""
        echo "📁 $(basename $dir)"
        cd "$dir"
        
        # Show branch
        BRANCH=$(git branch --show-current)
        echo "   Branch: $BRANCH"
        
        # Show last commit
        LAST_COMMIT=$(git log -1 --oneline)
        echo "   Last commit: $LAST_COMMIT"
        
        # Count files
        FILE_COUNT=$(find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.jsx" -o -name "*.tsx" | wc -l)
        echo "   UI Files: $FILE_COUNT"
        
        # Show status
        CHANGES=$(git status --porcelain | wc -l)
        echo "   Uncommitted changes: $CHANGES"
        
        cd - > /dev/null
    fi
done
```

### Merge Best Design Back to Main
```bash
# merge-design.sh
# Usage: ./merge-design.sh <design-number>

DESIGN_NUM=${1}
if [ -z "$DESIGN_NUM" ]; then
    echo "Usage: $0 <design-number>"
    exit 1
fi

BRANCH="design-${DESIGN_NUM}"

# Switch to main worktree
cd $(git worktree list | head -1 | awk '{print $1}')

# Checkout main and merge
git checkout main
git merge "$BRANCH" --no-ff -m "Merge design variant $DESIGN_NUM into main"

echo "✅ Merged design-$DESIGN_NUM into main"
```

### Clean Up Worktrees
```bash
# cleanup-worktrees.sh
# Remove all design worktrees (keeps main)

echo "Cleaning up design worktrees..."

git worktree list --porcelain | grep "^worktree" | cut -d' ' -f2 | while read -r worktree; do
    if [[ $worktree == *"frontend-design"* ]]; then
        echo "Removing: $worktree"
        git worktree remove "$worktree" --force
    fi
done

echo "✅ Cleanup complete"
git worktree list
```

## Workflow Patterns

### Pattern 1: Parallel Feature Exploration
```bash
# Create worktrees for different feature approaches
git worktree add ../design-cards -b design-cards
git worktree add ../design-list -b design-list  
git worktree add ../design-grid -b design-grid
git worktree add ../design-table -b design-table
git worktree add ../design-kanban -b design-kanban
```

### Pattern 2: Theme Variations
```bash
# Create worktrees for different themes
git worktree add ../theme-light -b theme-light
git worktree add ../theme-dark -b theme-dark
git worktree add ../theme-high-contrast -b theme-high-contrast
git worktree add ../theme-colorful -b theme-colorful
git worktree add ../theme-minimal -b theme-minimal
```

### Pattern 3: Responsive Design Testing
```bash
# Create worktrees for different viewport optimizations
git worktree add ../design-mobile -b design-mobile
git worktree add ../design-tablet -b design-tablet
git worktree add ../design-desktop -b design-desktop
git worktree add ../design-ultrawide -b design-ultrawide
git worktree add ../design-print -b design-print
```

## Best Practices

### 1. Naming Conventions
- Use descriptive branch names: `design-<variant>-<feature>`
- Keep worktree directories organized: `../frontend-<variant>`
- Document each design's purpose in `DESIGN_NOTES.md`

### 2. Commit Strategy
- Make frequent commits in each worktree
- Use descriptive commit messages mentioning the design variant
- Tag promising designs: `git tag design-v1-candidate`

### 3. Collaboration
```bash
# Push all design branches to remote
for branch in $(git branch -r | grep design-); do
    git push -u origin $branch
done
```

### 4. Design Review Process
```bash
# Create a comparison report
echo "# Design Review Report" > DESIGN_REVIEW.md
echo "Generated: $(date)" >> DESIGN_REVIEW.md
echo "" >> DESIGN_REVIEW.md

for i in {1..5}; do
    echo "## Design $i" >> DESIGN_REVIEW.md
    echo "- Branch: design-$i" >> DESIGN_REVIEW.md
    echo "- Directory: ../frontend-design-$i" >> DESIGN_REVIEW.md
    echo "- Status: In Progress" >> DESIGN_REVIEW.md
    echo "" >> DESIGN_REVIEW.md
done
```

## Utility Functions

### Check Worktree Status
```bash
# status-all.sh
# Show git status for all worktrees

for worktree in $(git worktree list --porcelain | grep "^worktree" | cut -d' ' -f2); do
    echo "=== $worktree ==="
    git -C "$worktree" status -s
    echo ""
done
```

### Sync All Worktrees with Remote
```bash
# sync-all.sh
# Pull latest changes for all worktrees

for worktree in $(git worktree list --porcelain | grep "^worktree" | cut -d' ' -f2); do
    echo "Syncing $worktree..."
    git -C "$worktree" pull --rebase
done
```

### Archive a Design
```bash
# archive-design.sh
# Usage: ./archive-design.sh <design-number>

DESIGN_NUM=$1
BRANCH="design-${DESIGN_NUM}"
ARCHIVE_BRANCH="archive/${BRANCH}"

git branch -m "$BRANCH" "$ARCHIVE_BRANCH"
git worktree remove "../frontend-design-${DESIGN_NUM}"
echo "✅ Archived design-${DESIGN_NUM} to ${ARCHIVE_BRANCH}"
```

## Troubleshooting

### Issue: "branch already checked out"
```bash
# Force remove and recreate
git worktree remove --force <path>
git worktree prune
git worktree add <path> -b <new-branch>
```

### Issue: "worktree is dirty"
```bash
# Stash changes before removing
git -C <worktree-path> stash
git worktree remove <worktree-path>
```

### Issue: "invalid ref"
```bash
# Clean up and repair
git worktree prune
git gc --prune=now
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `git worktree add <path> -b <branch>` | Create new worktree |
| `git worktree list` | List all worktrees |
| `git worktree remove <path>` | Remove worktree |
| `git worktree prune` | Clean up stale worktrees |
| `git worktree lock <path>` | Prevent auto-removal |
| `git worktree unlock <path>` | Allow auto-removal |

## Environment Variables

```bash
# Add to your .bashrc or .zshrc for quick access

# Quick worktree switching
wd() {
    cd "../frontend-design-$1" || echo "Design $1 not found"
}

# List designs
alias wl="git worktree list"

# Create new design worktree
wnew() {
    git worktree add "../frontend-design-$1" -b "design-$1"
    cd "../frontend-design-$1"
}

# Remove design worktree
wrm() {
    git worktree remove "../frontend-design-$1"
}
```

## Notes

- Each worktree shares the same Git repository data
- Worktrees are lightweight (only working files are duplicated)
- You can have up to 20 worktrees by default
- Worktrees are perfect for parallel development without branch switching
- All worktrees see the same stashes, tags, and remote branches

---

*Last updated: Use these scripts as templates and modify based on your specific needs.*
# Launch Parallel Frontend Implementations

## Quick Start

To launch 5 parallel frontend implementations with continuous task processing:

```bash
# Run this complete setup and launch script
bash -c "$(cat << 'EOF'
#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Launching 5 Parallel Frontend Implementations${NC}"
echo "================================================"

# Step 1: Create worktrees
echo -e "\n${YELLOW}Step 1: Creating 5 worktrees...${NC}"
for i in {1..5}; do
  if [ -d "../oiron-frontend-v$i" ]; then
    echo "Worktree v$i already exists, skipping..."
  else
    git worktree add ../oiron-frontend-v$i -b frontend-v$i
    echo -e "${GREEN}✓${NC} Created worktree v$i"
  fi
done

# Step 2: Prepare task files
echo -e "\n${YELLOW}Step 2: Preparing task files for continuous execution...${NC}"
for i in {1..5}; do
  echo "Preparing worktree v$i..."
  
  # Copy necessary files
  cp -r tasks ../oiron-frontend-v$i/ 2>/dev/null || true
  cp -r .cursor ../oiron-frontend-v$i/ 2>/dev/null || true
  cp -r .claude ../oiron-frontend-v$i/ 2>/dev/null || true
  
  # Create continuous task file
  cd ../oiron-frontend-v$i
  cp tasks/tasks-prd-oiron-frontend-mockup.md tasks/tasks-continuous-oiron-v$i.md
  
  # Add variant instructions
  cat >> tasks/tasks-continuous-oiron-v$i.md << 'VARIANT'

## Implementation Variant: V$i
This is implementation variant $i of 5 parallel implementations.

### Design Focus for This Variant:
VARIANT
  
  # Add specific variant instructions
  case $i in
    1)
      echo "- **UI Library**: Material-UI (MUI)" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Style**: Modern Material Design with bold colors" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Focus**: Consumer-friendly, approachable interface" >> tasks/tasks-continuous-oiron-v$i.md
      ;;
    2)
      echo "- **UI Library**: Ant Design Pro" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Style**: Enterprise professional with data density" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Focus**: Power users and complex workflows" >> tasks/tasks-continuous-oiron-v$i.md
      ;;
    3)
      echo "- **UI Library**: Tailwind UI + Headless UI" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Style**: Minimal clean with maximum white space" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Focus**: Simplicity and clarity" >> tasks/tasks-continuous-oiron-v$i.md
      ;;
    4)
      echo "- **UI Library**: Tremor (dashboard-focused)" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Style**: Dark mode first, widget-heavy" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Focus**: Data visualization excellence" >> tasks/tasks-continuous-oiron-v$i.md
      ;;
    5)
      echo "- **UI Library**: Radix UI + Custom components" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Style**: AI-first with chat-centric layout" >> tasks/tasks-continuous-oiron-v$i.md
      echo "- **Focus**: Conversational interface priority" >> tasks/tasks-continuous-oiron-v$i.md
      ;;
  esac
  
  cd - > /dev/null
  echo -e "${GREEN}✓${NC} Prepared worktree v$i"
done

# Step 3: Display launch instructions
echo -e "\n${YELLOW}Step 3: Launch Instructions${NC}"
echo "================================================"
echo -e "${GREEN}Setup complete!${NC} Now launch 5 Claude Code sessions:"
echo ""

# Check if tmux is available
if command -v tmux &> /dev/null; then
  echo -e "${BLUE}Option A: Using tmux (Recommended)${NC}"
  echo "Run this command to launch all 5 sessions in tmux:"
  echo ""
  echo "bash ~/.claude/scripts/launch-tmux-sessions.sh"
  echo ""
fi

echo -e "${BLUE}Option B: Manual Launch${NC}"
echo "Open 5 terminal windows and run in each:"
echo ""
for i in {1..5}; do
  echo "Terminal $i:"
  echo "  cd ../oiron-frontend-v$i"
  echo "  claude"
  echo "  # Then paste the continuous execution command below"
  echo ""
done

echo -e "${YELLOW}Continuous Execution Command for Each Claude:${NC}"
echo '```'
cat << 'COMMAND'
Please implement all tasks in tasks/tasks-continuous-oiron-vX.md following these guidelines:

1. Work through ALL 88 sub-tasks continuously without stopping
2. Follow the continuous execution mode from .cursor/rules/prd-driven-workflow/03-process-tasks-continuous.mdc
3. Complete each parent task fully before moving to the next
4. Run tests and commit after each parent task completion
5. Update the task file marking completed items with [x]
6. Use the variant-specific design focus specified in the task file
7. Continue until all tasks are complete

Start with Task 1.0 and proceed systematically through all tasks.
COMMAND
echo '```'

echo -e "\n${GREEN}✅ Ready to start parallel development!${NC}"
EOF
)"
```

## Setup Scripts

### Create and Prepare Worktrees

```bash
# setup-worktrees.sh
#!/bin/bash

echo "🌳 Setting up 5 parallel worktrees..."

# Create worktrees
for i in {1..5}; do
  if [ ! -d "../oiron-frontend-v$i" ]; then
    git worktree add ../oiron-frontend-v$i -b frontend-v$i
    echo "✓ Created worktree v$i"
  else
    echo "⚠ Worktree v$i already exists"
  fi
done

# List all worktrees
echo -e "\n📋 Current worktrees:"
git worktree list
```

### Prepare Task Files

```bash
# prepare-tasks.sh
#!/bin/bash

echo "📝 Preparing task files for continuous execution..."

for i in {1..5}; do
  echo "Processing worktree v$i..."
  
  # Ensure directories exist
  mkdir -p ../oiron-frontend-v$i/tasks
  mkdir -p ../oiron-frontend-v$i/.cursor/rules/prd-driven-workflow
  mkdir -p ../oiron-frontend-v$i/.claude
  
  # Copy essential files
  cp tasks/prd-oiron-frontend-mockup.md ../oiron-frontend-v$i/tasks/ 2>/dev/null || true
  cp tasks/tasks-prd-oiron-frontend-mockup.md ../oiron-frontend-v$i/tasks/tasks-continuous-oiron-v$i.md
  cp -r .cursor/rules/prd-driven-workflow/* ../oiron-frontend-v$i/.cursor/rules/prd-driven-workflow/ 2>/dev/null || true
  cp -r .claude/* ../oiron-frontend-v$i/.claude/ 2>/dev/null || true
  
  echo "✓ Prepared worktree v$i"
done
```

## Launch Scripts

### Launch with tmux (Recommended)

```bash
# launch-tmux-sessions.sh
#!/bin/bash

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
  echo "tmux is not installed. Please install it first:"
  echo "  Ubuntu/Debian: sudo apt-get install tmux"
  echo "  macOS: brew install tmux"
  exit 1
fi

# Kill existing session if it exists
tmux kill-session -t oiron-dev 2>/dev/null || true

# Create new tmux session
tmux new-session -d -s oiron-dev

# Create 5 windows
for i in {1..5}; do
  if [ $i -eq 1 ]; then
    tmux rename-window -t oiron-dev:0 "Frontend-V$i"
  else
    tmux new-window -t oiron-dev -n "Frontend-V$i"
  fi
  
  # Navigate to worktree
  tmux send-keys -t oiron-dev:Frontend-V$i "cd $(pwd)/../oiron-frontend-v$i" Enter
  tmux send-keys -t oiron-dev:Frontend-V$i "clear" Enter
  tmux send-keys -t oiron-dev:Frontend-V$i "echo '🚀 Frontend V$i - Ready for Claude Code'" Enter
  tmux send-keys -t oiron-dev:Frontend-V$i "echo 'Run: claude'" Enter
  tmux send-keys -t oiron-dev:Frontend-V$i "echo 'Then paste the continuous execution command'" Enter
done

echo "✅ tmux session 'oiron-dev' created with 5 windows"
echo ""
echo "To attach to the session:"
echo "  tmux attach -t oiron-dev"
echo ""
echo "tmux shortcuts:"
echo "  Ctrl+b, n     - Next window"
echo "  Ctrl+b, p     - Previous window"
echo "  Ctrl+b, [0-4] - Jump to window"
echo "  Ctrl+b, d     - Detach from session"
```

### Launch with GNU Screen

```bash
# launch-screen-sessions.sh
#!/bin/bash

# Check if screen is installed
if ! command -v screen &> /dev/null; then
  echo "screen is not installed. Please install it first:"
  echo "  Ubuntu/Debian: sudo apt-get install screen"
  echo "  macOS: brew install screen"
  exit 1
fi

# Create screen sessions
for i in {1..5}; do
  screen -dmS "oiron-v$i" bash -c "cd ../oiron-frontend-v$i; echo 'Frontend V$i Ready'; bash"
  echo "✓ Created screen session oiron-v$i"
done

echo ""
echo "To attach to a session:"
echo "  screen -r oiron-v1  (or v2, v3, v4, v5)"
echo ""
echo "Screen shortcuts:"
echo "  Ctrl+a, d - Detach from session"
```

### Launch with Multiple Terminals

```bash
# launch-terminals.sh
#!/bin/bash

echo "🖥️ Launching 5 terminal windows..."

for i in {1..5}; do
  # Detect OS and launch terminals accordingly
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e "
      tell application \"Terminal\"
        do script \"cd $(pwd)/../oiron-frontend-v$i && echo 'Frontend V$i Ready' && echo 'Run: claude'\"
        set custom title of front window to \"Frontend V$i\"
      end tell
    "
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux with gnome-terminal
    if command -v gnome-terminal &> /dev/null; then
      gnome-terminal --title="Frontend V$i" -- bash -c "cd $(pwd)/../oiron-frontend-v$i && echo 'Frontend V$i Ready' && echo 'Run: claude' && bash"
    # Linux with xterm
    elif command -v xterm &> /dev/null; then
      xterm -title "Frontend V$i" -e "cd $(pwd)/../oiron-frontend-v$i && echo 'Frontend V$i Ready' && echo 'Run: claude' && bash" &
    fi
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows Git Bash
    start bash -c "cd $(pwd)/../oiron-frontend-v$i && echo 'Frontend V$i Ready' && echo 'Run: claude' && bash"
  fi
  
  sleep 1
done

echo "✓ Launched 5 terminal windows"
```

## Monitoring Scripts

### Real-time Progress Monitor

```bash
# monitor-progress.sh
#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

while true; do
  clear
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}       OIRON FRONTEND PARALLEL IMPLEMENTATION MONITOR${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
  
  # Summary statistics
  total_completed=0
  
  for i in {1..5}; do
    if [ -d "../oiron-frontend-v$i" ]; then
      cd ../oiron-frontend-v$i
      
      # Count completed tasks
      if [ -f "tasks/tasks-continuous-oiron-v$i.md" ]; then
        completed=$(grep -c "^\- \[x\]" tasks/tasks-continuous-oiron-v$i.md 2>/dev/null || echo "0")
        total_completed=$((total_completed + completed))
      else
        completed=0
      fi
      
      cd - > /dev/null
    fi
  done
  
  echo -e "${GREEN}Total Tasks Completed: $total_completed / 440 (88 × 5)${NC}"
  echo ""
  
  # Individual worktree status
  for i in {1..5}; do
    echo -e "${YELLOW}━━━ Frontend V$i ━━━${NC}"
    
    if [ -d "../oiron-frontend-v$i" ]; then
      cd ../oiron-frontend-v$i
      
      # Task completion
      if [ -f "tasks/tasks-continuous-oiron-v$i.md" ]; then
        completed=$(grep -c "^\- \[x\]" tasks/tasks-continuous-oiron-v$i.md 2>/dev/null || echo "0")
        total=88
        percent=$((completed * 100 / total))
        
        # Progress bar
        bar_length=30
        filled=$((percent * bar_length / 100))
        empty=$((bar_length - filled))
        
        echo -n "Progress: ["
        printf "%${filled}s" | tr ' ' '█'
        printf "%${empty}s" | tr ' ' '░'
        echo "] $completed/$total ($percent%)"
      else
        echo "Progress: Task file not found"
      fi
      
      # Git status
      commits=$(git rev-list --count HEAD 2>/dev/null || echo "0")
      last_commit=$(git log -1 --format="%s" 2>/dev/null || echo "No commits yet")
      echo "Commits: $commits | Last: $last_commit"
      
      # Check if Next.js is running
      port=$((3000 + i))
      if lsof -i :$port > /dev/null 2>&1; then
        echo -e "Dev Server: ${GREEN}✓ Running on port $port${NC}"
      else
        echo -e "Dev Server: ${RED}✗ Not running${NC}"
      fi
      
      # Check for package.json
      if [ -f "package.json" ]; then
        echo -e "Project: ${GREEN}✓ Initialized${NC}"
      else
        echo -e "Project: ${YELLOW}⧗ Not initialized${NC}"
      fi
      
      cd - > /dev/null
    else
      echo -e "${RED}Worktree not found${NC}"
    fi
    echo ""
  done
  
  echo "Press Ctrl+C to exit | Refreshing in 30 seconds..."
  sleep 30
done
```

### Quick Status Check

```bash
# status.sh
#!/bin/bash

echo "📊 Quick Status Check"
echo "===================="

for i in {1..5}; do
  echo ""
  echo "Frontend V$i:"
  
  if [ -d "../oiron-frontend-v$i" ]; then
    cd ../oiron-frontend-v$i
    
    # Check completion
    if [ -f "tasks/tasks-continuous-oiron-v$i.md" ]; then
      completed=$(grep -c "^\- \[x\]" tasks/tasks-continuous-oiron-v$i.md 2>/dev/null || echo "0")
      echo "  Tasks: $completed/88 completed"
    fi
    
    # Check if project is initialized
    if [ -f "package.json" ]; then
      echo "  Status: Project initialized"
    else
      echo "  Status: Not yet initialized"
    fi
    
    cd - > /dev/null
  else
    echo "  Status: Worktree not created"
  fi
done
```

## Comparison Scripts

### Compare All Implementations

```bash
# compare-implementations.sh
#!/bin/bash

echo "🔍 Comparing All Implementations"
echo "================================"

# Create comparison report
report_file="comparison-report-$(date +%Y%m%d-%H%M%S).md"
echo "# Frontend Implementation Comparison Report" > $report_file
echo "Generated: $(date)" >> $report_file
echo "" >> $report_file

for i in {1..5}; do
  echo "" | tee -a $report_file
  echo "## Frontend V$i" | tee -a $report_file
  
  if [ -d "../oiron-frontend-v$i" ]; then
    cd ../oiron-frontend-v$i
    
    # Statistics
    echo "### Statistics" | tee -a $report_file
    
    # Count components
    components=$(find src/components -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
    echo "- Components: $components" | tee -a $report_file
    
    # Count pages
    pages=$(find src/app -name "page.tsx" 2>/dev/null | wc -l | tr -d ' ')
    echo "- Pages: $pages" | tee -a $report_file
    
    # Count tests
    tests=$(find . -name "*.test.tsx" -o -name "*.test.ts" 2>/dev/null | wc -l | tr -d ' ')
    echo "- Tests: $tests" | tee -a $report_file
    
    # Git stats
    commits=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    echo "- Commits: $commits" | tee -a $report_file
    
    # Dependencies
    if [ -f "package.json" ]; then
      deps=$(grep -c '".*":' package.json | head -1)
      echo "- Dependencies: ~$deps" | tee -a $report_file
    fi
    
    # Bundle size
    if [ -d ".next" ]; then
      size=$(du -sh .next 2>/dev/null | cut -f1)
      echo "- Build size: $size" | tee -a $report_file
    fi
    
    cd - > /dev/null
  else
    echo "Not created" | tee -a $report_file
  fi
done

echo ""
echo "✅ Report saved to: $report_file"
```

### Launch All Dev Servers

```bash
# view-all.sh
#!/bin/bash

echo "🚀 Launching all dev servers..."

for i in {1..5}; do
  if [ -d "../oiron-frontend-v$i" ]; then
    cd ../oiron-frontend-v$i
    
    if [ -f "package.json" ]; then
      port=$((3000 + i))
      
      # Kill existing process on port
      lsof -ti:$port | xargs kill -9 2>/dev/null || true
      
      # Set port and start
      echo "PORT=$port" > .env.local
      npm run dev > /dev/null 2>&1 &
      echo "✓ Started Frontend V$i on port $port"
    else
      echo "⚠ Frontend V$i not initialized yet"
    fi
    
    cd - > /dev/null
  fi
done

echo ""
echo "Waiting for servers to start..."
sleep 5

echo ""
echo "📱 Opening all frontends in browser..."
for i in {1..5}; do
  port=$((3000 + i))
  if lsof -i:$port > /dev/null 2>&1; then
    # Detect OS and open browser
    if [[ "$OSTYPE" == "darwin"* ]]; then
      open "http://localhost:$port"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      xdg-open "http://localhost:$port" 2>/dev/null || true
    fi
    echo "✓ Opened http://localhost:$port"
  fi
done
```

## Cleanup Scripts

### Remove All Worktrees

```bash
# cleanup-worktrees.sh
#!/bin/bash

echo "🧹 Cleaning up worktrees..."
echo "WARNING: This will remove all 5 frontend worktrees!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

for i in {1..5}; do
  if [ -d "../oiron-frontend-v$i" ]; then
    git worktree remove ../oiron-frontend-v$i --force
    echo "✓ Removed worktree v$i"
  fi
done

# Prune worktree references
git worktree prune
echo "✓ Pruned worktree references"

git worktree list
```

## Continuous Execution Command

When launching Claude Code in each worktree, use this command:

```
Please implement all tasks in tasks/tasks-continuous-oiron-vX.md following these guidelines:

1. Work through ALL 88 sub-tasks continuously without stopping
2. Follow the continuous execution mode from .cursor/rules/prd-driven-workflow/03-process-tasks-continuous.mdc
3. Complete each parent task fully before moving to the next
4. Run tests and commit after each parent task completion
5. Update the task file marking completed items with [x]
6. Use the variant-specific design focus specified in the task file
7. Create all components and pages as specified in the Relevant Files section
8. Implement smooth interactions and animations
9. Use mock data for all financial information
10. Continue until all tasks are complete

Start with Task 1.0: Initialize Frontend Project and Design System Foundation

Key implementation notes:
- This is a pure frontend mockup with no backend
- Use mock data for all interactions
- Focus on smooth user journeys and interactions
- Implement all 4 user personas' complete journeys
- Ensure responsive design for mobile, tablet, and desktop

Begin now with task 1.1 and proceed continuously through all tasks.
```

## Tips and Best Practices

### Running Effectively

1. **Start all worktrees simultaneously** - Don't wait for one to finish before starting others
2. **Use tmux or screen** - Makes it easier to manage multiple sessions
3. **Monitor regularly** - Check progress every 30 minutes
4. **Let them run** - The continuous mode means minimal intervention needed

### Handling Issues

1. **If a Claude session stops**:
   - Check the task file to see where it stopped
   - Restart with: "Continue from task X.X in tasks/tasks-continuous-oiron-vX.md"

2. **If builds fail**:
   - Each implementation is independent
   - Can fix issues in one without affecting others

3. **If running out of resources**:
   - Consider running 2-3 at a time instead of all 5
   - Use the cleanup script to remove completed ones

### Selecting the Best Implementation

After all implementations complete:

1. Run `view-all.sh` to see all 5 running
2. Test each with the 4 user journeys
3. Compare using the comparison script
4. Document decision in main branch
5. Merge the winning implementation

## Quick Reference Card

```bash
# One-line setup and launch
cd /path/to/orion-frontend-design-mockup
bash .claude/launch-parallel-frontends.md

# Monitor progress
bash monitor-progress.sh

# View all implementations
bash view-all.sh

# Compare implementations
bash compare-implementations.sh

# Clean up when done
bash cleanup-worktrees.sh
```

## Expected Timeline

- **Setup**: 5 minutes
- **Implementation**: 4-6 hours (all running in parallel)
- **Testing & Comparison**: 1 hour
- **Total**: ~7 hours for 5 complete implementations

## Success Metrics

✅ All 5 implementations complete all 88 tasks
✅ Each has working navigation and user journeys  
✅ Mock data and interactions fully functional
✅ Can run all 5 simultaneously for comparison
✅ Clear winner emerges based on quality and UX

---

*This command automates the entire process of running 5 parallel frontend implementations using git worktrees and continuous task processing.*
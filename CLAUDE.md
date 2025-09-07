# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Orion Frontend Design Mockup** - A comprehensive frontend mockup implementation for an AI-first Financial Planning & Analysis (FP&A) web application designed to replace IBM TM1 Cognos. This is a pure frontend project with no backend integration, focusing on UI/UX design and user journey demonstrations.

## Project Architecture

### Core Components
The project implements a complete FP&A platform mockup covering:
- **MVP1-2**: Financial reporting and interactive analysis
- **MVP3-4**: Cost allocation and budgeting interfaces  
- **MVP5**: AI assistant and natural language features
- **MVP6**: Strategic planning and advanced dashboards

### Key User Personas
Four primary personas drive the design:
- **Priya** (Finance Analyst): Reports, drill-downs, exports
- **David** (Financial Controller): Consolidation, cost allocation, approvals
- **Sarah** (CFO): Executive dashboards, AI chat, strategic planning
- **Mark** (Department Head): Budget submission, spending tracking

## Development Approach

### Design Implementation
This project implements a comprehensive frontend mockup using Material-UI and Tailwind CSS for a modern, enterprise-ready FP&A platform. The design focuses on user experience, data visualization, and responsive layouts optimized for financial workflows.

### Task Management System
Tasks are managed through:
- **PRD**: `tasks/prd-orion-frontend-mockup.md` - Complete requirements (70 functional requirements)
- **Task List**: `tasks/tasks-prd-orion-frontend-mockup.md` - 88 implementation sub-tasks
- **Continuous Mode**: Rename to `tasks-continuous-*.md` for automatic sequential execution

## Key Commands

### Development Setup
```bash
# Initialize Next.js with TypeScript and Tailwind
npx create-next-app@latest . --typescript --tailwind --app

# Install UI libraries
npm install @mui/material @emotion/react @emotion/styled

# Install charting libraries
npm install recharts chart.js react-chartjs-2 d3
```

### Running the Application
```bash
# Development server
npm run dev  # Runs on port 5000
```

## File Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Main dashboard
├── components/
│   ├── navigation/        # Sidebar, TopBar, Breadcrumbs
│   ├── dashboard/         # Widgets, customizable layouts
│   ├── reports/           # Financial statements, drill-down tables
│   ├── scenario/          # What-if analysis, comparisons
│   ├── allocation/        # Cost allocation builders
│   ├── budget/           # Budget forms, approval workflows
│   ├── ai/               # Chat interface, insight cards
│   ├── charts/           # Unified chart library
│   └── mobile/           # Mobile-specific components
├── lib/
│   ├── mockData/         # Financial data, users, AI responses
│   ├── theme/            # Design tokens, theme configuration
│   └── utils/            # Mock animations, helpers
└── styles/               # Global CSS, Tailwind config
```

## Implementation Guidelines

### Mock Data Strategy
- All data is mocked - no real API calls
- Use `setTimeout/setInterval` for simulated real-time updates
- Export functionality generates sample PDF/Excel files
- AI responses are pre-defined Q&A pairs

### Key Features to Implement
1. **Drag-and-drop dashboard widgets** with grid layout
2. **Drill-down tables** with animated transitions
3. **Inline cell editing** with recalculation animations
4. **Scenario sliders** with real-time impact visualization
5. **AI chat** with typing indicators and mock responses
6. **Mobile responsive** with touch-optimized controls
7. **Dark/light theme** toggle with CSS variables

### Continuous Task Processing
When using continuous mode (`tasks-continuous-*.md`):
1. Work through all sub-tasks sequentially without stopping
2. Mark tasks with `[x]` as completed
3. Commit after each parent task completion
4. Run tests before committing
5. Continue until all 88 tasks complete

## Cursor/Claude Rules Integration

### PRD-Driven Workflow
Located in `.cursor/rules/prd-driven-workflow/`:
- `01-create-prd.mdc`: PRD generation with clarifying questions
- `02-generate-tasks.mdc`: Task breakdown from PRDs
- `03-process-tasks-continuous.mdc`: Continuous task execution

### Key Workflow Commands
- Generate PRD: Follow `01-create-prd.mdc` structure
- Create tasks: Use `02-generate-tasks.mdc` for breakdown
- Continuous execution: Apply `03-process-tasks-continuous.mdc` rules

## Success Criteria

Each implementation must:
- Complete all 88 sub-tasks from the task list
- Implement all 4 user journey tests (Tasks 7.14-7.17)
- Support responsive design (mobile, tablet, desktop)
- Include smooth animations and transitions
- Provide working navigation between all pages
- Generate mock PDF/Excel exports
- Display AI-powered insights with mock data

## Testing User Journeys

Test each persona's complete flow:
1. **Priya**: Login → View Reports → Drill Down → Export
2. **David**: Dashboard → Cost Allocation → Approval
3. **Sarah**: Executive Dashboard → AI Chat → Strategic Planning
4. **Mark**: Budget Form → Submit → Track Spending
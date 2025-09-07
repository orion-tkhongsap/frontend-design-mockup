# Dashboard Redesign Implementation Plan
## Orion FP&A Platform - Bloomberg-Inspired Design

### Project Overview
Transform the current basic dashboard into a comprehensive financial command center with Bloomberg's signature aesthetics while serving Orion's FP&A platform requirements for all user personas (Priya - Finance Analyst, David - Financial Controller, Sarah - CFO, Mark - Department Head).

---

## 1. Visual Design System

### Color Palette (Bloomberg-Inspired)
```css
/* Dark Theme (Primary) */
--bg-primary: #0A0E1A;        /* Deep blue-black background */
--bg-secondary: #141922;      /* Slightly lighter panels */
--bg-tertiary: #1C2128;       /* Card backgrounds */

/* Data Colors */
--positive: #00FF88;          /* Green for positive values */
--negative: #FF3366;          /* Red for negative values */
--neutral: #00BFFF;           /* Electric blue for neutral/highlight */
--warning: #FFB800;           /* Amber for warnings */

/* Text Colors */
--text-primary: #FFFFFF;      /* Primary text */
--text-secondary: #A0A0A0;    /* Secondary text */
--text-muted: #606060;        /* Muted text */

/* Light Theme */
--light-bg: #FFFFFF;
--light-bg-secondary: #F8F9FA;
--light-text: #1A1A1A;
```

### Typography
```css
/* Font Stack */
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;  /* For numbers */
--font-sans: 'Inter', -apple-system, sans-serif;      /* For labels */

/* Font Sizes */
--text-xs: 10px;
--text-sm: 12px;
--text-base: 14px;
--text-lg: 16px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 32px;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing & Layout
```css
/* Grid System */
--grid-columns: 12;
--grid-gap: 16px;
--container-padding: 24px;

/* Component Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

---

## 2. Dashboard Layout Structure

### Grid Layout Design
```
┌─────────────────────────────────────────────────────────────────┐
│                    Executive Alert Bar (Full Width)             │
├─────────────────────────────────────────────────────────────────┤
│  KPI Command Center (8 cols)    │  Quick Stats (4 cols)         │
├──────────────────────────────────┼──────────────────────────────┤
│  Financial Statements (6 cols)   │  AI Insights (6 cols)        │
├──────────────────────────────────┴──────────────────────────────┤
│              Scenario Analysis Panel (Full Width)               │
├─────────────────────────────────────────────────────────────────┤
│  Budget Status (4 cols) │ Dept Perf (4 cols) │ Actions (4 cols) │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Implementation Plan

### Phase 1: Core Layout & Theme (Day 1)

#### 3.1 DashboardLayout Component
**File:** `src/app/dashboard/DashboardLayout.tsx`
- [ ] Create responsive grid container
- [ ] Implement 12-column CSS Grid system
- [ ] Add theme toggle (dark/light mode)
- [ ] Set up responsive breakpoints
- [ ] Add loading states skeleton

#### 3.2 Theme Provider
**File:** `src/lib/theme/ThemeContext.tsx`
- [ ] Create theme context with dark/light modes
- [ ] Implement theme persistence in localStorage
- [ ] Add CSS variables for dynamic theming
- [ ] Create useTheme hook

### Phase 2: Data Infrastructure (Day 1)

#### 3.3 Mock Data Generators
**File:** `src/lib/mockData/financialData.ts`
- [ ] Generate 3 years of P&L data
- [ ] Create Balance Sheet mock data
- [ ] Generate Cash Flow statements
- [ ] Create department-level budgets
- [ ] Generate variance data
- [ ] Create KPI trending data

#### 3.4 Data Utilities
**File:** `src/lib/utils/dataFormatters.ts`
- [ ] Number formatting (K, M, B notation)
- [ ] Percentage formatting
- [ ] Currency formatting
- [ ] Date range formatters
- [ ] Variance calculators

### Phase 3: Core Components (Day 2)

#### 3.5 Executive Alert Bar
**File:** `src/components/dashboard/ExecutiveAlertBar.tsx`
**Features:**
- [ ] Scrolling alert ticker
- [ ] Priority-based sorting
- [ ] Alert type icons (warning, error, info, success)
- [ ] Dismissible alerts
- [ ] Click-through to details
**Mock Alerts:**
- "Revenue variance exceeds 10% threshold in Q4"
- "Month-end consolidation 85% complete"
- "3 budget approvals pending review"
- "Cash flow forecast shows potential shortfall in 60 days"

#### 3.6 KPI Command Center
**File:** `src/components/dashboard/KPICommandCenter.tsx`
**Metrics to Display:**
- [ ] Revenue (YTD, QTD, MTD)
- [ ] Gross Margin %
- [ ] Operating Expenses
- [ ] EBITDA
- [ ] Cash Position
- [ ] DSO (Days Sales Outstanding)
- [ ] Working Capital
- [ ] Budget Variance %
**Features per Metric:**
- [ ] Current value with formatting
- [ ] Mini sparkline chart (30 days)
- [ ] YoY/QoQ comparison
- [ ] Trend arrow indicator
- [ ] Click for drill-down
- [ ] Hover tooltip with details

#### 3.7 Financial Statements Widget
**File:** `src/components/dashboard/FinancialStatements.tsx`
**Features:**
- [ ] Tab navigation (P&L, Balance Sheet, Cash Flow)
- [ ] Period selector dropdown
- [ ] Comparison toggle (Actual vs Budget vs Prior Year)
- [ ] Collapsible line items
- [ ] Variance highlighting
- [ ] Export buttons (Excel, PDF)
- [ ] Loading animation

### Phase 4: Advanced Components (Day 3)

#### 3.8 AI Insights Panel
**File:** `src/components/dashboard/AIInsightsPanel.tsx`
**Insight Types:**
- [ ] Variance explanations
- [ ] Trend predictions
- [ ] Anomaly detection
- [ ] Recommendations
- [ ] Risk alerts
**Features:**
- [ ] Insight cards with severity indicators
- [ ] Confidence scores
- [ ] Action buttons
- [ ] Feedback mechanism (helpful/not helpful)
- [ ] "View More" expansion

#### 3.9 Scenario Analysis Widget
**File:** `src/components/dashboard/ScenarioAnalysis.tsx`
**Features:**
- [ ] Scenario selector dropdown
- [ ] Key driver sliders:
  - Revenue Growth %
  - Cost Reduction %
  - Headcount Change
  - Price Adjustment %
- [ ] Impact visualization chart
- [ ] Save scenario button
- [ ] Compare scenarios side-by-side
- [ ] Reset to baseline

#### 3.10 Budget Status Grid
**File:** `src/components/dashboard/BudgetStatus.tsx`
**Features:**
- [ ] Department grid view
- [ ] Progress bars for each department
- [ ] Budget vs Actual mini charts
- [ ] Status indicators (on track, at risk, over budget)
- [ ] Approval workflow status
- [ ] Drill-down to department details

### Phase 5: Interactive Features (Day 4)

#### 3.11 Quick Actions Panel
**File:** `src/components/dashboard/QuickActions.tsx`
**Actions by Persona:**
- [ ] **Priya (Analyst)**:
  - Generate Monthly Report
  - Run Variance Analysis
  - Export to Excel
  - Create Scenario
- [ ] **David (Controller)**:
  - Review Cost Allocations
  - Approve Budgets
  - Check Consolidation
  - View Audit Trail
- [ ] **Sarah (CFO)**:
  - Generate Board Deck
  - View Executive Summary
  - Strategic Planning
  - Chat with AI
- [ ] **Mark (Dept Head)**:
  - Submit Budget
  - View My Department
  - Check Allocations
  - Request Adjustment

#### 3.12 Charts Library
**File:** `src/components/charts/DashboardCharts.tsx`
**Chart Types:**
- [ ] Sparkline component
- [ ] Area chart for trends
- [ ] Bar chart for comparisons
- [ ] Waterfall for variance
- [ ] Gauge for KPIs
- [ ] Heat map for budget status

### Phase 6: Enhancements (Day 5)

#### 3.13 Real-time Simulation
**File:** `src/lib/utils/realtimeSimulator.ts`
- [ ] WebSocket mock connection
- [ ] Random data updates every 5-10 seconds
- [ ] Smooth number transitions
- [ ] Alert generation
- [ ] Activity feed updates

#### 3.14 Responsive Design
- [ ] Mobile layout (stack all components)
- [ ] Tablet layout (2-column grid)
- [ ] Touch gestures support
- [ ] Swipeable panels
- [ ] Responsive charts

#### 3.15 Performance Optimizations
- [ ] Implement React.memo for components
- [ ] Use lazy loading for heavy components
- [ ] Virtualize long lists
- [ ] Optimize re-renders
- [ ] Add loading skeletons

---

## 4. Implementation Checklist

### Day 1: Foundation
- [ ] Set up dashboard route and layout
- [ ] Implement theme system
- [ ] Create mock data generators
- [ ] Build data formatting utilities
- [ ] Set up component file structure

### Day 2: Core Components
- [ ] Complete Executive Alert Bar
- [ ] Build KPI Command Center
- [ ] Implement Financial Statements widget
- [ ] Add basic interactivity

### Day 3: Advanced Features
- [ ] Create AI Insights Panel
- [ ] Build Scenario Analysis widget
- [ ] Implement Budget Status Grid
- [ ] Add drill-down capabilities

### Day 4: Interactivity & Polish
- [ ] Implement Quick Actions panel
- [ ] Add all chart types
- [ ] Create smooth animations
- [ ] Implement export functionality

### Day 5: Testing & Refinement
- [ ] Test all user journeys
- [ ] Optimize performance
- [ ] Ensure responsive design
- [ ] Add keyboard navigation
- [ ] Final polish and bug fixes

---

## 5. Mock Data Structure

### KPI Data Structure
```typescript
interface KPIMetric {
  id: string;
  name: string;
  value: number;
  unit: 'currency' | 'percentage' | 'number';
  change: number;
  changeType: 'increase' | 'decrease';
  trend: number[]; // 30-day sparkline data
  target: number;
  status: 'on-track' | 'at-risk' | 'off-track';
}
```

### Financial Statement Structure
```typescript
interface FinancialStatement {
  period: string;
  type: 'P&L' | 'BalanceSheet' | 'CashFlow';
  lineItems: {
    id: string;
    name: string;
    actual: number;
    budget: number;
    variance: number;
    children?: LineItem[];
  }[];
}
```

### Alert Structure
```typescript
interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: {
    label: string;
    link: string;
  };
}
```

---

## 6. Success Criteria

### Functional Requirements
- [ ] All 4 personas can complete their primary tasks
- [ ] Data updates simulate real-time changes
- [ ] All interactive elements provide feedback
- [ ] Export functionality works for all data views
- [ ] Theme switching works seamlessly

### Performance Metrics
- [ ] Initial load < 2 seconds
- [ ] Smooth animations (60 fps)
- [ ] No layout shifts during data updates
- [ ] Responsive on all device sizes

### User Experience
- [ ] Intuitive navigation without training
- [ ] Clear visual hierarchy
- [ ] Consistent interaction patterns
- [ ] Accessible via keyboard
- [ ] Professional Bloomberg-like aesthetics

---

## 7. Testing Scenarios

### Persona-Based User Journeys

#### Priya (Finance Analyst)
1. View dashboard → Check KPI metrics
2. Click on Revenue metric → Drill down to details
3. Switch to P&L view → Export to Excel
4. Review AI insights → Take recommended action

#### David (Financial Controller)
1. Check alert bar → Review consolidation status
2. View budget status → Approve pending budgets
3. Check cost allocations → Drill into variances
4. Generate monthly close report

#### Sarah (CFO)
1. Review executive alerts → Check critical KPIs
2. Run scenario analysis → Adjust growth assumptions
3. View AI insights → Prepare board narrative
4. Generate executive summary

#### Mark (Department Head)
1. Check department budget status
2. View actual vs budget variance
3. Review cost allocations to department
4. Submit budget adjustment request

---

## 8. Future Enhancements (Post-MVP)

- [ ] Customizable dashboard layouts
- [ ] Saved view configurations
- [ ] Advanced filtering options
- [ ] Collaborative annotations
- [ ] Integration with Excel add-in
- [ ] Voice commands for navigation
- [ ] Predictive analytics visualizations
- [ ] Mobile app companion

---

## 9. Technical Notes

### Dependencies Required
```json
{
  "recharts": "^2.5.0",
  "framer-motion": "^10.0.0",
  "date-fns": "^2.30.0",
  "clsx": "^2.0.0",
  "lucide-react": "^0.309.0"
}
```

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

---

**Document Version:** 1.0
**Last Updated:** January 2025
**Author:** Claude Code Assistant
**Status:** Ready for Implementation
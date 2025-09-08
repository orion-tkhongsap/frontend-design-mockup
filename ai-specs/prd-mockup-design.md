# Product Requirements Document: Orion Mockup Design
## Bloomberg.com-Inspired Modern Financial Web Platform

**Version:** 1.0  
**Date:** January 2025  
**Purpose:** Client Presentation & User Testing Mockup

---

## 1. Executive Summary

This PRD defines a professional-grade mockup web application for **Orion**, an AI-first Financial Planning & Analysis platform designed to replace IBM TM1 Cognos. The mockup adopts Bloomberg.com's modern web design aesthetic—clean, content-focused, and data-rich—creating a premium financial interface that demonstrates Orion's capabilities without backend integration.

**Key Objective:** Create a fully interactive mockup within 3-5 days that serves as a discussion tool with stakeholders, showcasing professional UI/UX inspired by Bloomberg.com's modern web platform, with clean layouts, strong typography, and data-rich visualizations.

---

## 2. Design Philosophy: Bloomberg.com Modern Web

### 2.1 Core Design Principles

**Clean, Content-First Design**
- Clear information hierarchy with strong typography
- Strategic use of whitespace for readability
- Card-based layouts for content organization
- Mobile-responsive from the ground up

**Professional Color Palette**
- Light, clean backgrounds (white/off-white primary)
- Bloomberg blue for brand and navigation
- Green/red for financial indicators
- High contrast for accessibility

**Speed & Efficiency**
- Keyboard-first navigation
- Command palette for power users
- Instant search across all data
- Minimal click depth (max 2 clicks to any feature)

---

## 3. User Personas & Journey Maps

### 3.1 Primary Personas

**Priya - Finance Analyst**
- **Journey:** Login → Dashboard → P&L Report → Drill-down → Export
- **Key Interactions:** Rapid data navigation, multi-tab workflows, Excel exports
- **Bloomberg Feature:** Split-screen analysis, keyboard shortcuts

**David - Financial Controller**
- **Journey:** Dashboard → Anomaly Alerts → Cost Allocation → Approval Workflow
- **Key Interactions:** Real-time consolidation monitoring, audit trails
- **Bloomberg Feature:** Alert panels, compliance dashboards

**Sarah - CFO**
- **Journey:** Executive Dashboard → AI Chat → Strategic Planning → Board Deck
- **Key Interactions:** Natural language queries, scenario modeling
- **Bloomberg Feature:** Command-line interface, executive summaries

**Mark - Department Head**
- **Journey:** Budget Portal → Input Forms → Variance Analysis → Spending Tracker
- **Key Interactions:** Simplified interfaces, mobile access
- **Bloomberg Feature:** Personalized workspace, role-based views

---

## 4. Bloomberg-Inspired UI Components

### 4.1 Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ MARKET TICKER | ORION FP&A | ALERTS (3) | USER | ⚙️        │ <- Header Bar
├───────────┬─────────────────────────────────────────────────┤
│           │ COMMAND: _                            │ HELP     │ <- Command Bar
│    NAV    ├─────────────────────────────────────────────────┤
│           │                                                 │
│  Reports  │              MAIN WORKSPACE                     │
│  Planning │     ┌──────────────┬──────────────┐           │
│  Analysis │     │   Panel 1    │   Panel 2    │           │
│    AI     │     ├──────────────┴──────────────┤           │
│  Budgets  │     │          Panel 3            │           │
│ Allocation│     └─────────────────────────────┘           │
│ Strategic │                                                 │
│           │                                                 │
└───────────┴─────────────────────────────────────────────────┘
```

### 4.2 Color Palette (Bloomberg-Inspired)

```css
/* Bloomberg.com Website Colors */
--bb-white: #FFFFFF;        /* Main background */
--bb-off-white: #F7F7F7;    /* Section backgrounds */
--bb-light-gray: #E8E8E8;   /* Borders, dividers */
--bb-gray: #737373;         /* Secondary text */
--bb-black: #000000;        /* Headlines */
--bb-blue: #0033A0;         /* Primary brand blue */
--bb-light-blue: #3B7DD8;   /* Links, CTAs */

/* Financial Indicators */
--bb-green: #059862;        /* Positive values */
--bb-red: #E74C3C;          /* Negative values */
--bb-neutral: #3B7DD8;      /* Neutral information */
--bb-warning: #FFA726;      /* Warnings */
```

### 4.3 Typography System

```css
/* Bloomberg.com Typography */
--font-headline: 'TiemposHeadline', Georgia, serif;
--font-body: 'AvenirNext', 'Helvetica Neue', sans-serif;
--font-data: 'BWHaasText', Arial, sans-serif;

/* Sizes */
--text-sm: 14px;   /* Small text */
--text-base: 16px; /* Body text */
--text-lg: 20px;   /* Subheaders */
--text-xl: 24px;   /* Headers */
--text-2xl: 32px;  /* Page titles */
--text-3xl: 40px;  /* Major headlines */
```

---

## 5. Feature-Specific Mockup Requirements

### 5.1 Strategic Planning Dashboard (MVP6)

**Bloomberg-Style Elements:**
- Multi-monitor layout simulation
- Real-time KPI ticker at top
- Heatmap for performance metrics
- Command shortcuts displayed

**Key Components:**
- Executive scorecard with traffic lights
- 3-5 year projection charts
- Competitive intelligence panel
- External market data integration

### 5.2 Financial Reporting & Analysis (MVP1-2)

**Bloomberg-Style Elements:**
- Dense data tables with inline sparklines
- Drill-down with breadcrumb navigation
- Multi-dimensional pivot tables
- Export queue panel

**Key Components:**
- P&L/Balance Sheet/Cash Flow tabs
- Period comparison selector
- Variance analysis with auto-commentary
- Anomaly detection badges

### 5.3 Cost Allocation Interface (MVP3)

**Bloomberg-Style Elements:**
- Sankey diagram for allocation flows
- Rule builder with visual feedback
- Audit trail sidebar
- Override authorization modal

**Key Components:**
- Drag-drop allocation builder
- Driver configuration panel
- Transparency reports
- Department impact preview

### 5.4 Monthly Forecast Planning (MVP2)

**Bloomberg-Style Elements:**
- Scenario comparison matrix
- Sensitivity analysis sliders
- What-if calculator panel
- Version control timeline

**Key Components:**
- Interactive forecast table
- Driver adjustment controls
- Impact visualization
- Scenario sandbox mode

### 5.5 Yearly Budgeting Interface (MVP4)

**Bloomberg-Style Elements:**
- Workflow status board
- Approval chain visualization
- Commentary thread panel
- Deadline countdown timer

**Key Components:**
- Department budget forms
- Consolidation dashboard
- Variance tracking
- AI baseline suggestions

### 5.6 AI Assistant Features (MVP5)

**Bloomberg-Style Elements:**
- Command-line interface
- Natural language terminal
- Response confidence meters
- Query history sidebar

**Key Components:**
- Chat interface with voice input
- Insight cards with actions
- Auto-generated narratives
- Predictive suggestions

---

## 6. Mockup Data Specifications

### 6.1 Static Data Sets

**Financial Data:**
- 3 years historical P&L, Balance Sheet, Cash Flow
- 12 months monthly actuals
- Budget vs actual variances
- Department-level breakdowns

**User Data:**
- 4 persona profiles with roles
- Department hierarchies
- Approval workflows
- Activity logs

**AI Responses:**
- 50+ pre-defined Q&A pairs
- Variance explanations
- Trend analyses
- Recommendation templates

### 6.2 Simulated Interactions

**Real-Time Updates:**
```javascript
// Simulate market ticker
setInterval(() => updateTicker(), 3000);

// Simulate data refresh
setInterval(() => flashUpdatedCells(), 5000);

// Simulate user activity
setInterval(() => showUserPresence(), 10000);
```

---

## 7. Technical Implementation

### 7.1 Technology Stack

**Frontend Framework:**
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for rapid styling
- Framer Motion for animations

**UI Libraries:**
- Recharts for financial charts
- AG-Grid for enterprise tables
- React DnD for drag-drop
- Headless UI for accessibility

### 7.2 Responsive Design

**Breakpoints:**
```css
/* Bloomberg-style responsive */
@media (min-width: 1920px) { /* Trading desk monitors */ }
@media (min-width: 1440px) { /* Standard desktop */ }
@media (min-width: 1024px) { /* Laptop */ }
@media (min-width: 768px)  { /* Tablet */ }
@media (max-width: 767px)  { /* Mobile */ }
```

### 7.3 Performance Targets

- Initial load: < 2 seconds
- Route transitions: < 300ms
- Data table rendering: < 500ms for 10K rows
- Chart updates: 60 FPS animations

---

## 8. User Testing Scenarios

### 8.1 Demo Script Flow

**Opening (30 seconds):**
1. Show Bloomberg-style login screen
2. Display market ticker animation
3. Load personalized dashboard

**Core Features (3 minutes each):**
1. Financial reporting with drill-down
2. Cost allocation configuration
3. Budget submission workflow
4. AI chat interaction
5. Strategic planning dashboard

**Closing (30 seconds):**
1. Export to PowerPoint simulation
2. Mobile responsive demonstration
3. Dark/light theme toggle

### 8.2 Interactive Elements

**Must-Have Interactions:**
- Drag-drop dashboard widgets
- Inline cell editing with recalculation
- Slider adjustments with live preview
- Command palette with fuzzy search
- Multi-select with bulk actions

---

## 9. Deliverables Timeline

### Day 1-2: Foundation
- [ ] Setup Next.js with Bloomberg color scheme
- [ ] Create layout components (Header, Sidebar, Workspace)
- [ ] Implement navigation and routing
- [ ] Build command palette

### Day 3-4: Core Features
- [ ] Financial reporting interfaces
- [ ] Cost allocation builder
- [ ] Budget forms and workflows
- [ ] AI chat interface

### Day 5: Polish & Testing
- [ ] Strategic planning dashboard
- [ ] Animations and transitions
- [ ] Mobile responsive testing
- [ ] Demo script preparation

---

## 10. Success Criteria

**Professional Appearance:**
- ✓ Matches Bloomberg Terminal aesthetics
- ✓ Information-dense layouts
- ✓ Smooth animations < 300ms
- ✓ Consistent color coding

**User Experience:**
- ✓ 2-click maximum to any feature
- ✓ Keyboard navigation throughout
- ✓ Role-based personalization
- ✓ Mobile responsive design

**Demo Effectiveness:**
- ✓ 5-minute complete walkthrough
- ✓ Clear value proposition display
- ✓ Stakeholder engagement features
- ✓ Export/share capabilities shown

---

## 11. Design Inspirations & References

### Bloomberg Terminal Features to Emulate:
- **BQL (Bloomberg Query Language)** → Natural language AI queries
- **SPLC (Split Screen)** → Multi-panel workspace
- **ALRT (Alerts)** → Real-time anomaly detection
- **PORT (Portfolio)** → Department budget tracking
- **XLTP (Excel Plugin)** → Export integration

### Competitive Benchmarks:
- **Workday Adaptive Planning:** Clean, modern UI
- **Anaplan:** Powerful modeling capabilities
- **OneStream:** Unified platform approach
- **Refinitiv Workspace:** Professional data density

---

## 12. Appendix: Component Library

### A. Bloomberg-Style Components

```tsx
// Command Bar Component
<CommandBar 
  placeholder="Enter command or search..."
  shortcuts={['META+K', 'F1 for help']}
  suggestions={['GO P&L', 'ALRT', 'EXPORT']}
/>

// Market Ticker Component  
<MarketTicker
  items={[
    { label: 'Revenue', value: '+5.2%', trend: 'up' },
    { label: 'EBITDA', value: '23.4%', trend: 'stable' },
    { label: 'OpEx', value: '-2.1%', trend: 'down' }
  ]}
/>

// Dense Data Table
<BloombergTable
  density="compact"
  showSparklines={true}
  highlightChanges={true}
  keyboardNavigation={true}
/>
```

### B. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Alt + 1-9` | Switch workspace tabs |
| `Cmd/Ctrl + D` | Duplicate current view |
| `F1` | Context help |
| `Esc` | Close modal/panel |
| `Tab` | Navigate fields |
| `Enter` | Drill down |
| `Cmd/Ctrl + E` | Export current view |

---

*This PRD creates a Bloomberg Terminal-quality mockup that will impress stakeholders and provide a tangible discussion framework for the Orion FP&A platform. The focus on professional aesthetics, information density, and power-user features positions Orion as an enterprise-grade solution.*
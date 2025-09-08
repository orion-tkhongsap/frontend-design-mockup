# Mockup Data Requirements: Orion Financial Platform
## Static Data Sets & Simulation Specifications

---

## 1. Financial Data Sets

### 1.1 Company Financial Statements

```json
{
  "company": "TCC Technology Corporation",
  "fiscal_year_end": "December 31",
  "reporting_currency": "USD",
  "data_periods": {
    "historical": ["2022", "2023", "2024"],
    "forecast": ["2025", "2026"],
    "budget": ["2025"]
  }
}
```

### 1.2 Income Statement Data

```javascript
const incomeStatementData = {
  "2024_Actual": {
    "Revenue": {
      "Product_Revenue": 45000000,
      "Service_Revenue": 28000000,
      "Subscription_Revenue": 12000000,
      "Total_Revenue": 85000000
    },
    "Cost_of_Revenue": {
      "Product_COGS": 18000000,
      "Service_COGS": 11200000,
      "Total_COGS": 29200000
    },
    "Gross_Profit": 55800000,
    "Operating_Expenses": {
      "Sales_Marketing": 17000000,
      "Research_Development": 12750000,
      "General_Administrative": 8500000,
      "Total_OpEx": 38250000
    },
    "EBITDA": 17550000,
    "Net_Income": 13162500
  },
  "2024_Budget": {
    "Total_Revenue": 82000000,
    "Total_COGS": 28700000,
    "Gross_Profit": 53300000,
    "Total_OpEx": 36900000,
    "EBITDA": 16400000,
    "Net_Income": 12300000
  },
  "variances": {
    "Revenue_Variance": 3000000,  // Positive
    "COGS_Variance": -500000,     // Negative (higher costs)
    "OpEx_Variance": -1350000,     // Negative (higher expenses)
    "EBITDA_Variance": 1150000,   // Positive
    "Net_Income_Variance": 862500  // Positive
  }
};
```

### 1.3 Balance Sheet Data

```javascript
const balanceSheetData = {
  "2024_Q4": {
    "Assets": {
      "Current_Assets": {
        "Cash": 25000000,
        "Accounts_Receivable": 14200000,
        "Inventory": 8500000,
        "Total_Current": 47700000
      },
      "Non_Current_Assets": {
        "PP&E": 35000000,
        "Intangibles": 12000000,
        "Total_Non_Current": 47000000
      },
      "Total_Assets": 94700000
    },
    "Liabilities": {
      "Current_Liabilities": {
        "Accounts_Payable": 6800000,
        "Short_Term_Debt": 5000000,
        "Total_Current": 11800000
      },
      "Long_Term_Debt": 15000000,
      "Total_Liabilities": 26800000
    },
    "Equity": {
      "Common_Stock": 30000000,
      "Retained_Earnings": 37900000,
      "Total_Equity": 67900000
    }
  }
};
```

### 1.4 Cash Flow Data

```javascript
const cashFlowData = {
  "2024": {
    "Operating_Activities": {
      "Net_Income": 13162500,
      "Depreciation": 3500000,
      "Working_Capital_Changes": -2100000,
      "Total_Operating": 14562500
    },
    "Investing_Activities": {
      "CapEx": -5000000,
      "Acquisitions": -8000000,
      "Total_Investing": -13000000
    },
    "Financing_Activities": {
      "Debt_Issuance": 10000000,
      "Debt_Repayment": -5000000,
      "Dividends": -2000000,
      "Total_Financing": 3000000
    },
    "Net_Cash_Flow": 4562500
  }
};
```

---

## 2. Department & Cost Center Data

### 2.1 Organizational Structure

```javascript
const departments = [
  {
    id: "TECH",
    name: "Technology",
    head: "Mark Thompson",
    budget_2025: 18500000,
    headcount: 120,
    cost_centers: ["Engineering", "IT Support", "DevOps", "QA"]
  },
  {
    id: "SALES",
    name: "Sales & Marketing",
    head: "Jennifer Chen",
    budget_2025: 22000000,
    headcount: 85,
    cost_centers: ["Direct Sales", "Marketing", "Customer Success", "BD"]
  },
  {
    id: "FIN",
    name: "Finance & Accounting",
    head: "David Miller",
    budget_2025: 8500000,
    headcount: 25,
    cost_centers: ["Accounting", "FP&A", "Treasury", "Tax"]
  },
  {
    id: "OPS",
    name: "Operations",
    head: "Robert Garcia",
    budget_2025: 15000000,
    headcount: 60,
    cost_centers: ["Supply Chain", "Logistics", "Facilities", "Procurement"]
  },
  {
    id: "HR",
    name: "Human Resources",
    head: "Lisa Anderson",
    budget_2025: 6000000,
    headcount: 20,
    cost_centers: ["Talent", "Compensation", "Benefits", "L&D"]
  }
];
```

### 2.2 Cost Allocation Rules

```javascript
const allocationRules = [
  {
    rule_id: "IT_ALLOC_01",
    name: "IT Infrastructure Allocation",
    source_pool: "IT Infrastructure Costs",
    total_amount: 3600000,
    driver: "Headcount",
    allocations: [
      { department: "Technology", percentage: 40, amount: 1440000 },
      { department: "Sales & Marketing", percentage: 28, amount: 1008000 },
      { department: "Operations", percentage: 20, amount: 720000 },
      { department: "Finance", percentage: 8, amount: 288000 },
      { department: "HR", percentage: 4, amount: 144000 }
    ]
  },
  {
    rule_id: "FAC_ALLOC_01",
    name: "Facilities Allocation",
    source_pool: "Facilities & Rent",
    total_amount: 2400000,
    driver: "Square Footage",
    allocations: [
      { department: "Technology", sqft: 15000, amount: 900000 },
      { department: "Sales & Marketing", sqft: 10000, amount: 600000 },
      { department: "Operations", sqft: 12000, amount: 720000 },
      { department: "Finance", sqft: 2000, amount: 120000 },
      { department: "HR", sqft: 1000, amount: 60000 }
    ]
  }
];
```

---

## 3. User & Role Data

### 3.1 User Profiles

```javascript
const users = [
  {
    id: "priya.sharma",
    name: "Priya Sharma",
    role: "Finance Analyst",
    department: "Finance & Accounting",
    permissions: ["view_all_reports", "edit_forecasts", "export_data"],
    dashboard_widgets: ["pl_summary", "variance_alerts", "forecast_accuracy"],
    recent_activity: [
      "Exported Q4 2024 P&L Statement",
      "Updated December forecast",
      "Reviewed cost allocation rules"
    ]
  },
  {
    id: "david.miller",
    name: "David Miller",
    role: "Financial Controller",
    department: "Finance & Accounting",
    permissions: ["admin", "lock_periods", "approve_allocations"],
    dashboard_widgets: ["consolidation_status", "anomaly_detector", "approval_queue"],
    recent_activity: [
      "Approved Q4 close",
      "Modified IT allocation rules",
      "Reviewed audit trail"
    ]
  },
  {
    id: "sarah.williams",
    name: "Sarah Williams",
    role: "CFO",
    department: "Executive",
    permissions: ["executive_view", "strategic_planning", "board_reports"],
    dashboard_widgets: ["executive_kpis", "ai_insights", "strategic_scorecard"],
    recent_activity: [
      "Generated board deck",
      "Reviewed strategic forecast",
      "Analyzed competitor metrics"
    ]
  },
  {
    id: "mark.thompson",
    name: "Mark Thompson",
    role: "Department Head",
    department: "Technology",
    permissions: ["view_department", "submit_budget", "view_allocations"],
    dashboard_widgets: ["budget_vs_actual", "department_kpis", "spending_tracker"],
    recent_activity: [
      "Submitted 2025 budget",
      "Reviewed Q4 spending",
      "Commented on allocation"
    ]
  }
];
```

---

## 4. AI Response Data

### 4.1 Natural Language Queries & Responses

```javascript
const aiResponses = [
  {
    query: "What drove the revenue increase in Q4?",
    response: {
      text: "Q4 2024 revenue increased by $3.5M (4.3%) compared to Q3, primarily driven by:\n\n1. **Subscription Revenue** (+$1.8M, 18% growth): New enterprise clients signed in October\n2. **Product Revenue** (+$1.2M, 2.7% growth): Holiday season demand spike\n3. **Service Revenue** (+$0.5M, 1.8% growth): Implementation projects for new clients",
      confidence: 0.92,
      data_points: ["revenue_by_segment", "customer_acquisition", "seasonal_trends"],
      visualization: "stacked_bar_chart"
    }
  },
  {
    query: "Show me our top 5 operating expenses",
    response: {
      text: "Top 5 Operating Expenses for 2024:",
      data: [
        { category: "Salaries & Benefits", amount: 28500000, percentage: 74.5 },
        { category: "Marketing & Advertising", amount: 4200000, percentage: 11.0 },
        { category: "Software & Licenses", amount: 2100000, percentage: 5.5 },
        { category: "Professional Services", amount: 1800000, percentage: 4.7 },
        { category: "Travel & Entertainment", amount: 1650000, percentage: 4.3 }
      ],
      visualization: "horizontal_bar_chart"
    }
  },
  {
    query: "Compare this year vs last year performance",
    response: {
      text: "Year-over-Year Performance Comparison:",
      metrics: {
        "Revenue Growth": { value: "+12.3%", trend: "positive" },
        "Gross Margin": { value: "65.6% vs 63.2%", trend: "positive" },
        "Operating Margin": { value: "20.6% vs 19.8%", trend: "positive" },
        "Customer Acquisition": { value: "+145 new clients", trend: "positive" },
        "Employee Turnover": { value: "8.2% vs 11.5%", trend: "positive" }
      },
      visualization: "comparison_dashboard"
    }
  }
];
```

### 4.2 Automated Insights

```javascript
const automatedInsights = [
  {
    type: "anomaly",
    severity: "high",
    title: "Unusual Spike in Marketing Spend",
    description: "Marketing expenses increased 45% above monthly average in December",
    impact: "$850,000 over budget",
    recommendation: "Review campaign ROI and adjust Q1 2025 marketing budget",
    affected_accounts: ["Sales & Marketing", "OpEx", "EBITDA"]
  },
  {
    type: "trend",
    severity: "medium",
    title: "Improving Cash Collection",
    description: "Days Sales Outstanding (DSO) decreased from 62 to 48 days",
    impact: "+$2.1M in operating cash flow",
    recommendation: "Continue current collection practices",
    affected_accounts: ["Accounts Receivable", "Cash Flow"]
  },
  {
    type: "forecast",
    severity: "low",
    title: "Q1 2025 Revenue Projection",
    description: "Based on pipeline and seasonal patterns, Q1 revenue likely to reach $22.5M",
    confidence: 0.85,
    factors: ["Pipeline strength", "Historical Q1 performance", "Market conditions"]
  }
];
```

---

## 5. Budget & Forecast Data

### 5.1 Annual Budget Data

```javascript
const budget2025 = {
  revenue: {
    Q1: 21000000,
    Q2: 22500000,
    Q3: 23500000,
    Q4: 25000000,
    total: 92000000
  },
  expenses: {
    Q1: 18500000,
    Q2: 19000000,
    Q3: 19500000,
    Q4: 20000000,
    total: 77000000
  },
  headcount: {
    Q1: 310,
    Q2: 325,
    Q3: 335,
    Q4: 350
  },
  key_initiatives: [
    { name: "Cloud Migration", budget: 2500000, owner: "Technology" },
    { name: "Market Expansion", budget: 3000000, owner: "Sales" },
    { name: "Process Automation", budget: 1500000, owner: "Operations" }
  ]
};
```

### 5.2 Rolling Forecast Data

```javascript
const rollingForecast = {
  updated: "2024-12-15",
  next_3_months: {
    Jan_2025: { revenue: 6800000, expenses: 6100000 },
    Feb_2025: { revenue: 6900000, expenses: 6150000 },
    Mar_2025: { revenue: 7300000, expenses: 6250000 }
  },
  assumptions: {
    growth_rate: 0.08,
    inflation_adjustment: 0.03,
    fx_rate: { USD_EUR: 0.92, USD_GBP: 0.79 }
  },
  scenarios: {
    base: { probability: 0.60, revenue_impact: 0 },
    optimistic: { probability: 0.25, revenue_impact: 0.15 },
    pessimistic: { probability: 0.15, revenue_impact: -0.20 }
  }
};
```

---

## 6. KPI & Metrics Data

### 6.1 Executive KPIs

```javascript
const executiveKPIs = [
  {
    metric: "Revenue Growth",
    current: 12.3,
    target: 10.0,
    unit: "%",
    status: "green",
    trend: "up",
    sparkline: [8.2, 9.1, 10.5, 11.2, 12.3]
  },
  {
    metric: "EBITDA Margin",
    current: 20.6,
    target: 22.0,
    unit: "%",
    status: "yellow",
    trend: "stable",
    sparkline: [19.8, 20.1, 20.3, 20.5, 20.6]
  },
  {
    metric: "Customer Retention",
    current: 94.5,
    target: 95.0,
    unit: "%",
    status: "yellow",
    trend: "down",
    sparkline: [95.2, 95.0, 94.8, 94.6, 94.5]
  },
  {
    metric: "Cash Conversion Cycle",
    current: 42,
    target: 45,
    unit: "days",
    status: "green",
    trend: "down",
    sparkline: [48, 46, 44, 43, 42]
  }
];
```

### 6.2 Operational Metrics

```javascript
const operationalMetrics = {
  sales: {
    pipeline_value: 45000000,
    win_rate: 0.28,
    average_deal_size: 125000,
    sales_cycle_days: 75
  },
  technology: {
    system_uptime: 99.95,
    incident_resolution_time: 2.4,
    deployment_frequency: 12,
    code_coverage: 78
  },
  operations: {
    inventory_turnover: 8.2,
    order_fulfillment_time: 3.2,
    supplier_performance: 96.5,
    warehouse_utilization: 82
  },
  hr: {
    employee_satisfaction: 4.2,
    turnover_rate: 8.2,
    time_to_hire: 32,
    training_hours_per_employee: 40
  }
};
```

---

## 7. Simulation & Animation Data

### 7.1 Real-Time Updates

```javascript
// Simulate market ticker updates
const marketTicker = {
  updateInterval: 3000, // 3 seconds
  metrics: [
    { label: "Revenue MTD", baseValue: 4250000, variance: 0.02 },
    { label: "OpEx MTD", baseValue: 3100000, variance: 0.01 },
    { label: "Cash Position", baseValue: 25000000, variance: 0.005 },
    { label: "AR Balance", baseValue: 14200000, variance: 0.03 }
  ]
};

// Simulate user activity
const userActivity = {
  updateInterval: 10000, // 10 seconds
  activities: [
    "Jennifer Chen viewed Sales Dashboard",
    "Mark Thompson updated Tech budget",
    "David Miller approved allocation",
    "Priya Sharma exported P&L report",
    "System: Month-end close initiated"
  ]
};

// Simulate data refresh
const dataRefresh = {
  tables: ["financial_statements", "budget_tracker", "kpi_dashboard"],
  refreshInterval: 5000, // 5 seconds
  animation: "pulse" // Visual feedback on update
};
```

### 7.2 Interactive Scenarios

```javascript
const whatIfScenarios = {
  revenue_growth: {
    slider_range: [-20, 50], // percentage
    base_value: 85000000,
    impact_calculations: {
      gross_profit: (revenue, margin = 0.656) => revenue * margin,
      ebitda: (revenue) => revenue * 0.206,
      headcount: (revenue) => Math.floor(revenue / 250000)
    }
  },
  cost_reduction: {
    slider_range: [-10, 30], // percentage
    categories: ["Personnel", "Marketing", "Technology", "Facilities"],
    constraints: {
      min_personnel: 0.7, // Can't reduce more than 30%
      min_marketing: 0.5  // Can't reduce more than 50%
    }
  },
  pricing_strategy: {
    products: ["Product A", "Product B", "Service C"],
    price_elasticity: [-2.5, -1.2, -0.8], // Demand sensitivity
    current_prices: [1200, 2500, 500],
    volume_impact: (price_change, elasticity) => price_change * elasticity
  }
};
```

---

## 8. Workflow & Approval Data

### 8.1 Budget Approval Workflow

```javascript
const approvalWorkflow = {
  budget_submissions: [
    {
      id: "BUD-2025-001",
      department: "Technology",
      submitter: "Mark Thompson",
      amount: 18500000,
      status: "pending_review",
      stage: 2,
      stages: [
        { name: "Draft", status: "completed", date: "2024-12-01" },
        { name: "Department Review", status: "completed", date: "2024-12-05" },
        { name: "Finance Review", status: "in_progress", reviewer: "Priya Sharma" },
        { name: "Controller Approval", status: "pending", reviewer: "David Miller" },
        { name: "CFO Approval", status: "pending", reviewer: "Sarah Williams" }
      ],
      comments: [
        { user: "Priya Sharma", text: "Please clarify cloud migration costs", date: "2024-12-06" },
        { user: "Mark Thompson", text: "Added breakdown in section 3.2", date: "2024-12-07" }
      ]
    }
  ]
};
```

### 8.2 Month-End Close Checklist

```javascript
const monthEndChecklist = {
  period: "December 2024",
  tasks: [
    { task: "Receive all invoices", owner: "AP Team", status: "completed", due: "2024-12-28" },
    { task: "Complete bank reconciliation", owner: "Treasury", status: "completed", due: "2024-12-29" },
    { task: "Post accruals", owner: "GL Team", status: "in_progress", due: "2024-12-30" },
    { task: "Run allocation rules", owner: "FP&A", status: "pending", due: "2024-12-31" },
    { task: "Generate trial balance", owner: "Accounting", status: "pending", due: "2024-12-31" },
    { task: "Review & approve close", owner: "Controller", status: "pending", due: "2025-01-02" }
  ],
  completion: 45, // percentage
  estimated_completion: "2025-01-02 18:00"
};
```

---

## 9. External & Market Data

### 9.1 Competitor Benchmarks

```javascript
const competitorData = {
  industry_average: {
    revenue_growth: 8.5,
    ebitda_margin: 18.2,
    r_and_d_spend: 12.5,
    customer_acquisition_cost: 8500
  },
  top_competitors: [
    { name: "CompetitorA", revenue: 120000000, growth: 15.2, margin: 22.1 },
    { name: "CompetitorB", revenue: 95000000, growth: 9.8, margin: 19.5 },
    { name: "TCC Technology", revenue: 85000000, growth: 12.3, margin: 20.6 },
    { name: "CompetitorC", revenue: 78000000, growth: 6.5, margin: 17.8 }
  ]
};
```

### 9.2 Economic Indicators

```javascript
const economicIndicators = {
  gdp_growth: 2.8,
  inflation_rate: 3.2,
  interest_rate: 5.25,
  unemployment: 3.9,
  consumer_confidence: 102.5,
  tech_sector_index: 1450.23,
  currency_rates: {
    USD_EUR: 0.92,
    USD_GBP: 0.79,
    USD_JPY: 148.50
  }
};
```

---

## 10. Mock Export Templates

### 10.1 Excel Export Format

```javascript
const excelExportTemplate = {
  filename: "Orion_Financial_Report_{date}.xlsx",
  sheets: [
    {
      name: "P&L Statement",
      headers: ["Account", "Actual", "Budget", "Variance", "Var %"],
      formatting: {
        currency: ["B:D"],
        percentage: ["E"],
        bold: ["1:1"],
        borders: "all"
      }
    },
    {
      name: "Balance Sheet",
      headers: ["Account", "Current Period", "Prior Period", "Change"],
      subtotals: ["Current Assets", "Total Assets", "Total Liabilities", "Total Equity"]
    },
    {
      name: "Charts",
      charts: ["Revenue Trend", "Expense Breakdown", "Cash Flow Waterfall"]
    }
  ]
};
```

### 10.2 PowerPoint Export Format

```javascript
const powerpointTemplate = {
  filename: "Board_Presentation_{date}.pptx",
  slides: [
    {
      layout: "title",
      content: {
        title: "Financial Performance Review",
        subtitle: "Q4 2024 Results",
        date: "{current_date}"
      }
    },
    {
      layout: "executive_summary",
      content: {
        kpis: ["Revenue: $85M (+12.3%)", "EBITDA: $17.6M (20.6%)", "Cash: $25M"],
        highlights: ["Record Q4 performance", "Strong cash generation", "Beat guidance"]
      }
    },
    {
      layout: "chart_with_text",
      content: {
        chart: "revenue_waterfall",
        bullets: ["Product revenue +$5.2M", "Service revenue +$3.1M", "Subscription +$1.8M"]
      }
    }
  ]
};
```

---

*This comprehensive mockup data specification provides all necessary static data, simulations, and templates needed to create a realistic, Bloomberg.com-inspired financial platform demonstration that will effectively showcase Orion's capabilities to stakeholders.*
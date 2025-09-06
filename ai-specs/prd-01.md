# **Product Requirements Document: Oiron**

**The AI-First Financial Planning & Analysis Platform for TCC Technology**

## **1\. Introduction & Vision**

This document outlines the requirements for **Oiron**, a new, internally-developed web application designed to replace the existing IBM TM1 Cognos system. Our current system serves its purpose as a reliable record-keeper and reporting tool but lacks the intelligence and proactivity required by a modern, data-driven organization.

**Vision:** To transform TCC Technology's financial operations from reactive reporting to proactive, AI-powered strategic guidance. Oiron will not just be a tool; it will be an indispensable assistant to our finance, accounting, and leadership teams, automating routine tasks, uncovering hidden insights, and enabling smarter, faster decision-making.

## **2\. Goals & Objectives**

* **Replicate & Enhance:** Achieve 100% feature parity with the core functions of TM1 currently in use (reporting, cost allocation, budgeting) and enhance the user experience.  
* **Reduce Manual Effort:** Automate data consolidation, report generation, and variance analysis to reduce the monthly closing time by at least 20%.  
* **Improve Forecast Accuracy:** Leverage AI and external data to improve the accuracy of financial forecasts by a measurable percentage.  
* **Empower Users:** Provide intuitive self-service analytics and "what-if" scenario modeling that doesn't require technical expertise.  
* **Deliver Proactive Insights:** Move beyond static reports to a system that automatically identifies anomalies, predicts trends, and provides actionable recommendations.

## **3\. User Personas**

1. **Priya, the Finance Analyst:**  
   * **Role:** Spends her days in the data, preparing reports, analyzing variances, and supporting the month-end close.  
   * **Pains:** Frustrated by manual data exports to Excel, slow report generation in TM1, and the time it takes to hunt for the "why" behind the numbers.  
   * **Needs:** A fast, reliable system with drill-down capabilities, automated variance commentary, and tools to quickly spot errors.  
2. **David, the Financial Controller:**  
   * **Role:** Responsible for the integrity of financial data, managing the closing process, and ensuring compliance.  
   * **Pains:** Worries about data errors from manual processes. Spends too much time reviewing reports instead of strategic planning. Needs to ensure cost allocations are fair and auditable.  
   * **Needs:** A single source of truth, strong audit trails, automated anomaly detection, and a streamlined workflow for financial consolidation.  
3. **Sarah, the CFO:**  
   * **Role:** Focuses on the company's overall financial health, strategic planning, and communicating performance to the board.  
   * **Pains:** Finds TM1 reports to be static and backward-looking. Lacks the ability to quickly model different business scenarios and see their P\&L impact.  
   * **Needs:** High-level dashboards, predictive forecasting, AI-generated executive summaries, and the ability to ask natural language questions about the business.  
4. **Mark, the Department Head (e.g., Head of Operations):**  
   * **Role:** Responsible for his department's budget and operational performance.  
   * **Pains:** Finds the current budgeting process cumbersome (spreadsheets). Doesn't have clear, real-time visibility into his department's spending against the budget.  
   * **Needs:** A simple, web-based portal to submit his budget, track performance, and understand the cost allocations applied to his department.

## **4\. Phased Feature Rollout (MVP 1-6)**

This roadmap is designed to deliver value at each stage, building a comprehensive platform over time.

### **MVP 1: The AI-Powered Reporting Foundation**

* **Theme:** Establish the "single source of truth" and build trust with a superior reporting experience.  
* **Features:**  
  * **Automated Data Ingestion:** Connectors to all relevant financial systems (ERP, GL).  
  * **Standard Financial Reports:** Interactive P\&L, Balance Sheet, and Cash Flow statements.  
  * **Drill-Down & Comparison:** Ability to drill down from summary to transaction level. Compare any two periods (MoM, QoQ, YoY, Actual vs. Budget).  
  * **AI Feature: Anomaly Detection:** The system automatically flags unusual transactions or journal entries that deviate from historical patterns, helping David and Priya spot errors faster.

### **MVP 2: Interactive Analysis & "What-If" Scenarios**

* **Theme:** Introduce write-back capabilities and empower users to model the future.  
* **Features:**  
  * **Interactive Report Editing:** Allow authorized users (like Priya) to change values directly in a report (e.g., adjust a revenue forecast number).  
  * **Real-time Recalculation:** The platform instantly recalculates all dependent figures (e.g., Gross Profit, Net Income) based on the user's change.  
  * **Scenario Sandboxing:** Users can create and save multiple "what-if" scenarios (e.g., "Aggressive Growth," "Recession Case") without affecting the official financial records.

### **MVP 3: The Intelligent Cost Allocation Engine**

* **Theme:** Automate the complex and often contentious process of cost allocation.  
* **Features:**  
  * **Allocation Rule Builder:** An intuitive UI for David to define multi-step allocation rules (e.g., "Allocate IT costs based on headcount").  
  * **Automated Execution:** Run the entire cost allocation process with a single click.  
  * **Transparency & Auditability:** Provide clear reports for department heads like Mark, showing exactly how costs were calculated and allocated to them.  
  * **AI Feature: Driver Recommendation:** The system analyzes cost pools and operational data to suggest the most statistically relevant drivers for allocation, improving fairness and accuracy.

### **MVP 4: Collaborative Budgeting & Forecasting Workflow**

* **Theme:** Streamline the company-wide planning process.  
* **Features:**  
  * **Budget Templates:** Web-based input templates for department heads like Mark to submit their annual budgets.  
  * **Workflow & Approvals:** A system for submission, review, commentary, and approval of budgets.  
  * **Real-time Consolidation:** As departments submit their budgets, Sarah and David see the company-wide numbers roll up in real-time.  
  * **AI Feature: Predictive Baseline:** Oiron generates a baseline forecast using time-series analysis of historical data. This serves as an unbiased starting point for the planning process, saving time and reducing manual guesswork.

### **MVP 5: The Financial Assistant & Natural Language**

* **Theme:** Fulfill the vision of an AI assistant that understands and explains the data.  
* **Features:**  
  * **Natural Language Query (NLQ):** A search bar where any user can ask questions like, *"What was our top 5 operating expense in Q3?"* or *"Compare cloud services revenue this year vs. last year."*  
  * **Automated Variance Commentary:** The system automatically generates text summaries explaining *why* a variance occurred (e.g., *"Revenue is 5% above budget, primarily driven by a 15% increase in new customer acquisition in the enterprise segment."*).  
  * **Personalized Dashboards:** Users can create and customize their own dashboards with the KPIs and charts most relevant to them.

### **MVP 6: Strategic Planning & External Intelligence**

* **Theme:** Elevate the platform from an operational tool to a strategic weapon.  
* **Features:**  
  * **Long-Range Planning Module:** Tools for building 3-5 year strategic financial models.  
  * **Automated Board Decks:** Generate key slides and charts for monthly and quarterly board meetings automatically.  
  * **AI Feature: External Data Integration:** The AI models will be enhanced with external data APIs (e.g., industry benchmarks, macroeconomic indicators, competitor data) to provide context-aware insights and more robust forecasts. For example, the system could alert Sarah that a competitor's reported earnings might impact TCC Tech's market share in the next quarter.
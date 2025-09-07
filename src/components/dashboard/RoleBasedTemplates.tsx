'use client'

import React from 'react'
import { DashboardWidget } from './DashboardGrid'

export type UserRole = 'analyst' | 'controller' | 'cfo' | 'department-head'

export const roleBasedTemplates: Record<UserRole, DashboardWidget[]> = {
  analyst: [
    {
      id: 'analyst-kpi-1',
      title: 'Revenue Analysis',
      type: 'kpi',
      size: { width: 6, height: 2 },
      position: { x: 0, y: 0 },
      config: { metric: 'revenue', period: 'monthly' },
    },
    {
      id: 'analyst-chart-1',
      title: 'Variance Trends',
      type: 'chart',
      size: { width: 6, height: 3 },
      position: { x: 6, y: 0 },
      config: { chartType: 'line', dataSource: 'budget-variance' },
    },
    {
      id: 'analyst-table-1',
      title: 'P&L Details',
      type: 'table',
      size: { width: 12, height: 4 },
      position: { x: 0, y: 3 },
      config: { dataSource: 'pl-statement', drillDown: true },
    },
  ],
  controller: [
    {
      id: 'controller-kpi-1',
      title: 'Budget vs Actual',
      type: 'kpi',
      size: { width: 4, height: 2 },
      position: { x: 0, y: 0 },
      config: { metric: 'budget-variance' },
    },
    {
      id: 'controller-kpi-2',
      title: 'Cost Center Performance',
      type: 'kpi',
      size: { width: 4, height: 2 },
      position: { x: 4, y: 0 },
      config: { metric: 'cost-center-efficiency' },
    },
    {
      id: 'controller-alert-1',
      title: 'Budget Alerts',
      type: 'alert',
      size: { width: 4, height: 2 },
      position: { x: 8, y: 0 },
      config: { alertType: 'budget-threshold' },
    },
    {
      id: 'controller-chart-1',
      title: 'Allocation Summary',
      type: 'chart',
      size: { width: 8, height: 3 },
      position: { x: 0, y: 2 },
      config: { chartType: 'donut', dataSource: 'cost-allocation' },
    },
  ],
  cfo: [
    {
      id: 'cfo-kpi-1',
      title: 'Key Financial Metrics',
      type: 'kpi',
      size: { width: 12, height: 2 },
      position: { x: 0, y: 0 },
      config: { metrics: ['revenue', 'ebitda', 'cash-flow'] },
    },
    {
      id: 'cfo-chart-1',
      title: 'Strategic Overview',
      type: 'chart',
      size: { width: 8, height: 4 },
      position: { x: 0, y: 2 },
      config: { chartType: 'executive-summary' },
    },
    {
      id: 'cfo-alert-1',
      title: 'Executive Alerts',
      type: 'alert',
      size: { width: 4, height: 4 },
      position: { x: 8, y: 2 },
      config: { alertType: 'executive', priority: 'high' },
    },
  ],
  'department-head': [
    {
      id: 'dept-kpi-1',
      title: 'Department Budget',
      type: 'kpi',
      size: { width: 6, height: 2 },
      position: { x: 0, y: 0 },
      config: { metric: 'department-budget', department: 'current' },
    },
    {
      id: 'dept-kpi-2',
      title: 'Team Performance',
      type: 'kpi',
      size: { width: 6, height: 2 },
      position: { x: 6, y: 0 },
      config: { metric: 'team-kpis' },
    },
    {
      id: 'dept-chart-1',
      title: 'Spending Trends',
      type: 'chart',
      size: { width: 12, height: 3 },
      position: { x: 0, y: 2 },
      config: { chartType: 'area', dataSource: 'department-spending' },
    },
  ],
}

export function getTemplateForRole(role: UserRole): DashboardWidget[] {
  return roleBasedTemplates[role] || roleBasedTemplates.analyst
}
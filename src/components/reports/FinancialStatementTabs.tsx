'use client'

import React, { useState } from 'react'
import { Box, Tabs, Tab, Paper } from '@mui/material'
import { Assessment, AccountBalance, TrendingUp } from '@mui/icons-material'
import { PLStatement } from './PLStatement'
import { BalanceSheet } from './BalanceSheet'
import { CashFlowStatement } from './CashFlowStatement'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`financial-tabpanel-${index}`}
      aria-labelledby={`financial-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

interface FinancialStatementTabsProps {
  period?: string
  comparisonPeriod?: string
}

export function FinancialStatementTabs({ 
  period = 'Q3 2025',
  comparisonPeriod = 'Q2 2025' 
}: FinancialStatementTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#fafbfc' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="financial statement tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                minHeight: 56,
                color: '#6b7280',
                '&.Mui-selected': {
                  color: '#486581',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#486581',
                height: 3,
              },
            }}
          >
            <Tab
              icon={<Assessment />}
              iconPosition="start"
              label="P&L Statement"
              id="financial-tab-0"
              aria-controls="financial-tabpanel-0"
            />
            <Tab
              icon={<AccountBalance />}
              iconPosition="start"
              label="Balance Sheet"
              id="financial-tab-1"
              aria-controls="financial-tabpanel-1"
            />
            <Tab
              icon={<TrendingUp />}
              iconPosition="start"
              label="Cash Flow"
              id="financial-tab-2"
              aria-controls="financial-tabpanel-2"
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <PLStatement period={period} comparisonPeriod={comparisonPeriod} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <BalanceSheet period={period} comparisonPeriod={comparisonPeriod} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            <CashFlowStatement period={period} comparisonPeriod={comparisonPeriod} />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  )
}
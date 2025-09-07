'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TrendingUp, PieChart, BarChart3, DollarSign } from 'lucide-react'

const metrics = [
  {
    title: 'Revenue YTD',
    value: '$12.4M',
    change: '+8.2% vs last year',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-success-600',
    bgColor: 'bg-success-50',
  },
  {
    title: 'Expenses YTD',
    value: '$9.8M',
    change: '+3.1% vs budget',
    trend: 'up',
    icon: BarChart3,
    color: 'text-warning-600',
    bgColor: 'bg-warning-50',
  },
  {
    title: 'Net Income',
    value: '$2.6M',
    change: '+18.5% vs last year',
    trend: 'up',
    icon: DollarSign,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
  },
  {
    title: 'Profit Margin',
    value: '21%',
    change: '+2.1pp vs target',
    trend: 'up',
    icon: PieChart,
    color: 'text-accent-600',
    bgColor: 'bg-accent-50',
  },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your financial overview. Monitor key metrics and access critical insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} hover className="group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <p className={`text-sm mt-2 ${metric.color}`}>
                      {metric.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Generate Report</Button>
            <Button variant="secondary">Create Scenario</Button>
            <Button variant="secondary">Review Budget</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
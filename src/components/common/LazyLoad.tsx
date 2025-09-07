import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface LazyLoadOptions {
  loading?: () => ReactNode
  ssr?: boolean
}

export function createLazyComponent<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  return dynamic(importFunc, {
    loading: options.loading || (() => <LoadingSpinner />),
    ssr: options.ssr ?? false,
  })
}

// Pre-defined lazy loaded heavy components
export const LazyFinancialCharts = dynamic(
  () => import('@/components/charts/FinancialCharts'),
  { 
    loading: () => <LoadingSpinner />,
    ssr: false 
  }
)

export const LazyEnterpriseDataTable = dynamic(
  () => import('@/components/common/EnterpriseDataTable').then(mod => ({ default: mod.EnterpriseDataTable })),
  { 
    loading: () => <LoadingSpinner />,
    ssr: false 
  }
)

export const LazyChatInterface = dynamic(
  () => import('@/components/ai/ChatInterface'),
  { 
    loading: () => <LoadingSpinner />,
    ssr: false 
  }
)

export const LazyDashboardGrid = dynamic(
  () => import('@/components/dashboard/DashboardGrid').then(mod => ({ default: mod.DashboardGrid })),
  { 
    loading: () => <LoadingSpinner />,
    ssr: false 
  }
)
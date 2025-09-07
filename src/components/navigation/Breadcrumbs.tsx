'use client'

import React from 'react'
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import {
  Home,
  NavigateNext,
  Dashboard,
  Assessment,
  PieChart,
  AccountBalance,
  Psychology,
  TrendingUp,
  RequestQuote,
} from '@mui/icons-material'
import { usePathname, useRouter } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  isActive?: boolean
  badge?: string | number
}

const routeConfig: Record<string, { label: string; icon?: React.ReactNode; parent?: string }> = {
  '/': { label: 'Home', icon: <Home /> },
  '/dashboard': { label: 'Dashboard', icon: <Dashboard /> },
  '/reports': { label: 'Reports', icon: <Assessment /> },
  '/reports/pl': { label: 'P&L Statement', icon: <TrendingUp />, parent: '/reports' },
  '/reports/balance': { label: 'Balance Sheet', icon: <AccountBalance />, parent: '/reports' },
  '/reports/cashflow': { label: 'Cash Flow', icon: <TrendingUp />, parent: '/reports' },
  '/scenarios': { label: 'Scenarios', icon: <PieChart /> },
  '/scenarios/builder': { label: 'Scenario Builder', parent: '/scenarios' },
  '/scenarios/compare': { label: 'Compare Scenarios', parent: '/scenarios' },
  '/allocations': { label: 'Cost Allocation', icon: <RequestQuote /> },
  '/budgets': { label: 'Budgeting', icon: <AccountBalance /> },
  '/budgets/input': { label: 'Budget Input', parent: '/budgets' },
  '/budgets/review': { label: 'Budget Review', parent: '/budgets' },
  '/budgets/approval': { label: 'Approval Workflow', parent: '/budgets' },
  '/ai': { label: 'AI Assistant', icon: <Psychology /> },
  '/planning': { label: 'Strategic Planning', icon: <TrendingUp /> },
}

interface BreadcrumbsProps {
  className?: string
  showIcons?: boolean
  maxItems?: number
  badge?: string | number
}

export function Breadcrumbs({ 
  className, 
  showIcons = true, 
  maxItems = 8,
  badge 
}: BreadcrumbsProps) {
  const pathname = usePathname()
  const router = useRouter()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Build the hierarchy
    const buildHierarchy = (path: string): string[] => {
      const config = routeConfig[path]
      if (config?.parent) {
        return [...buildHierarchy(config.parent), path]
      }
      return [path]
    }

    // Always start with Home if not on home page
    if (pathname !== '/') {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: showIcons ? <Home /> : undefined,
      })
    }

    // Build the full hierarchy for current path
    const hierarchy = buildHierarchy(pathname)
    
    hierarchy.forEach((path, index) => {
      const config = routeConfig[path]
      if (config) {
        const isLast = index === hierarchy.length - 1
        breadcrumbs.push({
          label: config.label,
          href: isLast ? undefined : path,
          icon: showIcons ? config.icon : undefined,
          isActive: isLast,
          badge: isLast ? badge : undefined,
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbItems = generateBreadcrumbs()

  const handleClick = (href: string) => {
    router.push(href)
  }

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <Box 
      className={className}
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        py: 1,
        px: 0,
      }}
    >
      <MuiBreadcrumbs
        maxItems={maxItems}
        separator={<NavigateNext fontSize="small" />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: '#6c757d',
            mx: 1,
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          if (isLast || !item.href) {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: isLast ? '#0d1b2a' : '#6c757d',
                }}
              >
                {item.icon && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontSize: '1.125rem',
                  }}>
                    {item.icon}
                  </Box>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isLast ? 600 : 400,
                    color: 'inherit',
                  }}
                >
                  {item.label}
                </Typography>
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      backgroundColor: '#486581',
                      color: 'white',
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                )}
              </Box>
            )
          }

          return (
            <Link
              key={index}
              onClick={() => handleClick(item.href!)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#486581',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#334e68',
                },
                transition: 'color 0.2s ease',
              }}
            >
              {item.icon && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: '1.125rem',
                }}>
                  {item.icon}
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  color: 'inherit',
                }}
              >
                {item.label}
              </Typography>
            </Link>
          )
        })}
      </MuiBreadcrumbs>
    </Box>
  )
}

// Hook for programmatic breadcrumb management
export function useBreadcrumbs() {
  const pathname = usePathname()
  
  const getCurrentPage = () => {
    const config = routeConfig[pathname]
    return config ? config.label : 'Unknown Page'
  }

  const getParentPath = () => {
    const config = routeConfig[pathname]
    return config?.parent
  }

  return {
    currentPage: getCurrentPage(),
    parentPath: getParentPath(),
    pathname,
  }
}
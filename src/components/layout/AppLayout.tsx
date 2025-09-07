'use client'

import { ReactNode, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, useMediaQuery, useTheme } from '@mui/material'
import { muiTheme } from '@/lib/theme/muiTheme'
import { PageTransition } from '@/components/ui/PageTransition'
import { Sidebar } from '@/components/navigation/Sidebar'
import { TopBar } from '@/components/navigation/TopBar'
import { WorkspaceTabs } from '@/components/navigation/WorkspaceTabs'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

const SIDEBAR_WIDTH = 280
const SIDEBAR_COLLAPSED_WIDTH = 64

function NavigationLayout({ children }: { children: ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      />

      {/* Main Content Area */}
      <Box 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        {/* Top Bar */}
        <TopBar 
          onMenuToggle={handleSidebarToggle}
          sidebarOpen={sidebarOpen}
          sidebarWidth={SIDEBAR_WIDTH}
          sidebarCollapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        />

        {/* Workspace Tabs */}
        <WorkspaceTabs />

        {/* Content Container */}
        <Box 
          component="main"
          sx={{ 
            flexGrow: 1,
            p: 3,
            pt: 2,
            mt: '64px', // Account for fixed top bar
            backgroundColor: '#f8fafc',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs showIcons sx={{ mb: 2 }} />
          
          {/* Page Content */}
          <PageTransition>
            {children}
          </PageTransition>
        </Box>
      </Box>
    </Box>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <NavigationLayout>
        {children}
      </NavigationLayout>
    </ThemeProvider>
  )
}
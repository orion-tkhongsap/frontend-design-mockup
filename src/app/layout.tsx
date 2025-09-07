'use client'

import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@/styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

// Create MUI theme that matches Orion design system
const theme = createTheme({
  palette: {
    primary: {
      main: '#486581',
      light: '#627d98',
      dark: '#334e68',
    },
    secondary: {
      main: '#6c757d',
      light: '#adb5bd',
      dark: '#495057',
    },
    success: {
      main: '#38a169',
      light: '#48bb78',
      dark: '#2f855a',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
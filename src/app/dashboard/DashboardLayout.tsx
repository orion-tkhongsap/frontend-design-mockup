'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme/ThemeContext'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen dashboard-container">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-lg bg-card border border-primary hover:bg-hover transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-warning" />
        ) : (
          <Moon className="w-5 h-5 text-neutral" />
        )}
      </button>

      {/* Main Content */}
      <div className="dashboard-content">
        {children}
      </div>

      <style jsx>{`
        .dashboard-container {
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-sans);
        }

        .dashboard-content {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: var(--container-padding);
        }

        .bg-card {
          background: var(--bg-card);
        }

        .border-primary {
          border-color: var(--border-primary);
        }

        .hover\\:bg-hover:hover {
          background: var(--bg-hover);
        }

        .text-warning {
          color: var(--color-warning);
        }

        .text-neutral {
          color: var(--color-neutral);
        }

        /* Grid System */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: var(--grid-gap);
          margin-bottom: var(--spacing-lg);
        }

        .col-span-1 { grid-column: span 1; }
        .col-span-2 { grid-column: span 2; }
        .col-span-3 { grid-column: span 3; }
        .col-span-4 { grid-column: span 4; }
        .col-span-5 { grid-column: span 5; }
        .col-span-6 { grid-column: span 6; }
        .col-span-7 { grid-column: span 7; }
        .col-span-8 { grid-column: span 8; }
        .col-span-9 { grid-column: span 9; }
        .col-span-10 { grid-column: span 10; }
        .col-span-11 { grid-column: span 11; }
        .col-span-12 { grid-column: span 12; }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: repeat(6, 1fr);
          }
          
          .lg\\:col-span-4 { grid-column: span 6; }
          .lg\\:col-span-6 { grid-column: span 6; }
          .lg\\:col-span-8 { grid-column: span 6; }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          [class*="col-span"] {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  )
}
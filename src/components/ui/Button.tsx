'use client'

import React, { forwardRef } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variantStyles = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
  secondary: 'bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600',
  success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm',
  warning: 'bg-warning-600 hover:bg-warning-700 text-white shadow-sm',
  danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-gray-100 text-primary-600',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon, 
    iconPosition = 'left',
    children, 
    disabled,
    className,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transform hover:-translate-y-0.5 active:translate-y-0',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
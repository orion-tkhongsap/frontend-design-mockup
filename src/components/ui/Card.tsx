'use client'

import React, { ReactNode, forwardRef } from 'react'
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material'
import { styled } from '@mui/material/styles'

export interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  actions?: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'elevated' | 'outlined' | 'flat'
  className?: string
  onClick?: () => void
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => !['hover'].includes(prop as string),
})<{ hover?: boolean }>(({ theme, hover }) => ({
  borderRadius: '12px',
  transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
  cursor: hover ? 'pointer' : 'default',
  ...(hover && {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.palette.mode === 'light' 
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    },
  }),
}))

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    title, 
    subtitle, 
    actions, 
    hover = false, 
    padding = 'md',
    variant = 'elevated',
    className,
    onClick,
    ...props 
  }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'elevated':
          return {
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: 'none',
          }
        case 'outlined':
          return {
            boxShadow: 'none',
            border: '1px solid #dee2e6',
          }
        case 'flat':
          return {
            boxShadow: 'none',
            border: 'none',
            backgroundColor: 'transparent',
          }
        default:
          return {}
      }
    }

    const getPaddingStyles = () => {
      switch (padding) {
        case 'none':
          return { padding: 0 }
        case 'sm':
          return { padding: '12px' }
        case 'md':
          return { padding: '20px' }
        case 'lg':
          return { padding: '32px' }
        default:
          return {}
      }
    }

    return (
      <StyledCard
        ref={ref}
        hover={hover}
        className={className}
        onClick={onClick}
        sx={{
          ...getVariantStyles(),
          backgroundColor: variant === 'flat' ? 'transparent' : undefined,
        }}
        {...props}
      >
        {(title || subtitle) && (
          <CardHeader
            title={title}
            subheader={subtitle}
            sx={{
              ...getPaddingStyles(),
              paddingBottom: children ? '8px' : getPaddingStyles().padding,
            }}
          />
        )}
        
        {children && (
          <CardContent
            sx={{
              ...getPaddingStyles(),
              paddingTop: (title || subtitle) ? '8px' : getPaddingStyles().padding,
              paddingBottom: actions ? '8px' : getPaddingStyles().padding,
              '&:last-child': {
                paddingBottom: actions ? '8px' : getPaddingStyles().padding,
              },
            }}
          >
            {children}
          </CardContent>
        )}
        
        {actions && (
          <CardActions
            sx={{
              ...getPaddingStyles(),
              paddingTop: '8px',
              justifyContent: 'flex-end',
            }}
          >
            {actions}
          </CardActions>
        )}
      </StyledCard>
    )
  }
)

Card.displayName = 'Card'
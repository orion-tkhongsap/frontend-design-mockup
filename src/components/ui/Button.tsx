'use client'

import React, { forwardRef, ReactNode } from 'react'
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  tooltip?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['loading'].includes(prop as string),
})<{ loading?: boolean }>(({ theme, loading }) => ({
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  ...(loading && {
    color: 'transparent',
  }),
}))

const LoadingWrapper = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    loadingText, 
    tooltip, 
    icon, 
    iconPosition = 'left',
    children, 
    disabled,
    ...props 
  }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            bgcolor: '#486581',
            color: 'white',
            '&:hover': { bgcolor: '#334e68' },
            '&:active': { bgcolor: '#243b53' },
          }
        case 'secondary':
          return {
            bgcolor: 'transparent',
            color: '#486581',
            border: '2px solid #486581',
            '&:hover': { bgcolor: 'rgba(72, 101, 129, 0.04)' },
          }
        case 'success':
          return {
            bgcolor: '#2f855a',
            color: 'white',
            '&:hover': { bgcolor: '#276749' },
          }
        case 'warning':
          return {
            bgcolor: '#d97706',
            color: 'white',
            '&:hover': { bgcolor: '#b45309' },
          }
        case 'danger':
          return {
            bgcolor: '#dc2626',
            color: 'white',
            '&:hover': { bgcolor: '#b91c1c' },
          }
        case 'ghost':
          return {
            bgcolor: 'transparent',
            color: '#486581',
            '&:hover': { bgcolor: 'rgba(72, 101, 129, 0.04)' },
          }
        default:
          return {}
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return { padding: '8px 16px', fontSize: '0.875rem', minHeight: '36px' }
        case 'md':
          return { padding: '12px 24px', fontSize: '1rem', minHeight: '44px' }
        case 'lg':
          return { padding: '16px 32px', fontSize: '1.125rem', minHeight: '52px' }
        default:
          return {}
      }
    }

    const buttonContent = (
      <>
        {icon && iconPosition === 'left' && !loading && (
          <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        {children}
        {icon && iconPosition === 'right' && !loading && (
          <span style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        {loading && (
          <LoadingWrapper>
            <CircularProgress size={16} color="inherit" />
            {loadingText && <span style={{ fontSize: '0.875rem' }}>{loadingText}</span>}
          </LoadingWrapper>
        )}
      </>
    )

    const button = (
      <StyledButton
        ref={ref}
        disabled={disabled || loading}
        loading={loading}
        sx={{
          ...getVariantStyles(),
          ...getSizeStyles(),
          borderRadius: '8px',
          boxShadow: variant !== 'ghost' && variant !== 'secondary' 
            ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
            : 'none',
          '&:hover': {
            ...getVariantStyles()['&:hover'],
            boxShadow: variant !== 'ghost' && variant !== 'secondary'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : 'none',
          },
        }}
        {...props}
      >
        {buttonContent}
      </StyledButton>
    )

    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow>
          <span>{button}</span>
        </Tooltip>
      )
    }

    return button
  }
)

Button.displayName = 'Button'
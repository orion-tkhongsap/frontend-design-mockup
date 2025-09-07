import React from 'react'
import { clsx } from 'clsx'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  hover?: boolean
  noPadding?: boolean
  interactive?: boolean
}

const variantStyles = {
  default: 'bg-white shadow-sm',
  elevated: 'bg-white shadow-lg',
  outlined: 'bg-white border-2 border-gray-200',
  glass: 'bg-white/80 backdrop-blur-sm shadow-lg',
}

export function Card({
  children,
  variant = 'default',
  hover = false,
  noPadding = false,
  interactive = false,
  className,
  onClick,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg transition-all duration-200',
        variantStyles[variant],
        !noPadding && 'p-6',
        hover && 'hover:shadow-xl hover:-translate-y-1',
        interactive && 'cursor-pointer active:scale-[0.98]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('mb-4 pb-4 border-b border-gray-200', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx('text-lg font-semibold text-gray-900', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx('text-sm text-gray-600 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-gray-200', className)} {...props}>
      {children}
    </div>
  )
}
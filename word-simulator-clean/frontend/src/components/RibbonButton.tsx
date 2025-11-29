import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface RibbonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  icon?: ReactNode
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export const RibbonButton = ({
  active = false,
  icon,
  label,
  size = 'md',
  className,
  children,
  ...props
}: RibbonButtonProps) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <button
      className={clsx(
        'flex items-center gap-1.5 rounded transition-colors border',
        'hover:bg-gray-100 active:bg-gray-200',
        active ? 'bg-blue-100 border-blue-400' : 'bg-white border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {label && <span>{label}</span>}
      {children}
    </button>
  )
}

interface RibbonSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const RibbonSelect = ({ label, className, children, ...props }: RibbonSelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-gray-600">{label}</label>}
      <select
        className={clsx(
          'px-2 py-1 text-sm border border-gray-300 rounded',
          'focus:outline-none focus:border-blue-400',
          'bg-white',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

interface RibbonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const RibbonInput = ({ label, className, ...props }: RibbonInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-gray-600">{label}</label>}
      <input
        className={clsx(
          'px-2 py-1 text-sm border border-gray-300 rounded',
          'focus:outline-none focus:border-blue-400',
          'w-20',
          className
        )}
        {...props}
      />
    </div>
  )
}

export const RibbonDivider = () => {
  return <div className="w-px h-8 bg-gray-300 mx-2" />
}

export const RibbonGroup = ({
  children,
  label,
}: {
  children: ReactNode
  label?: string
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 px-2">{children}</div>
      {label && (
        <div className="text-xs text-gray-600 text-center mt-1 px-2">{label}</div>
      )}
    </div>
  )
}

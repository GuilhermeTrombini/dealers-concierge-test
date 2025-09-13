import React, { useId } from 'react'
import { FormFieldProps } from './FormField.types'
import { Label } from '../../atoms'
import { clsx } from 'clsx'

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required = false,
  error,
  className,
}) => {
  const id = useId()
  
  return (
    <div className={clsx('space-y-1', className)}>
      <Label htmlFor={id} required={required}>{label}</Label>
      {React.cloneElement(children as React.ReactElement, { id })}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

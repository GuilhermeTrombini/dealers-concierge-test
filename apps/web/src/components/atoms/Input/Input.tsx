import { InputProps } from './Input.types'
import { clsx } from 'clsx'

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className,
  id,
  name,
  min,
  max,
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      min={min}
      max={max}
      className={clsx('input', className)}
    />
  )
}

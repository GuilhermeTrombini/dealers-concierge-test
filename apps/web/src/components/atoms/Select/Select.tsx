import { SelectProps } from './Select.types';
import { clsx } from 'clsx';

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  className,
  id,
  name,
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className={clsx('input', className)}
    >
      {placeholder && (
        <option value='' disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

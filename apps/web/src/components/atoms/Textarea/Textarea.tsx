import { TextareaProps } from './Textarea.types';
import { clsx } from 'clsx';

export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className,
  id,
  name,
  rows = 3,
  cols,
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
      cols={cols}
      className={clsx('input', className)}
    />
  );
};

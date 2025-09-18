import { LabelProps } from './Label.types';
import { clsx } from 'clsx';

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required = false,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        'block text-sm font-medium text-gray-700',
        required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
        className
      )}
    >
      {children}
    </label>
  );
};

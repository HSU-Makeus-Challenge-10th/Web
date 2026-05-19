import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  const base =
    'rounded font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 disabled:hover:bg-pink-500',
    secondary:
      'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500 disabled:hover:bg-gray-700',
    ghost:
      'bg-transparent text-gray-300 hover:text-white disabled:hover:text-gray-300',
    outline:
      'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-8',
    md: 'px-4 py-2 text-base min-h-9',
    lg: 'px-6 py-2.5 text-lg min-h-10',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

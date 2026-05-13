import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, showPasswordToggle, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    return (
      <div className="flex flex-col gap-[0.5vh] w-full">
        {label && (
          <label className="text-[0.9vw] font-medium text-gray-300">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full rounded border border-gray-600 bg-black px-[1vw] py-[0.8vh] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-[1vw]',
              showPasswordToggle && 'pr-[3vw]',
              className
            )}
            {...props}
          />
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[1vw] top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <Eye className="w-[1.5vw] h-[1.5vw] min-w-5 min-h-5" />
              ) : (
                <EyeOff className="w-[1.5vw] h-[1.5vw] min-w-5 min-h-5" />
              )}
            </button>
          )}
        </div>
        {error && <span className="text-[0.8vw] text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

import { forwardRef, useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showPasswordToggle?: boolean; // 비밀번호 가시성 토글 버튼 표시 여부
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, showPasswordToggle = false, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = showPasswordToggle
      ? showPassword ? 'text' : 'password'
      : type;

    return (
      <div>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 outline-none transition-colors ${
              showPasswordToggle ? 'pr-10' : ''
            } ${
              error
                ? 'border-red-500'
                : 'border-gray-700 focus:border-pink-500'
            } ${className ?? ''}`}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;

function EyeOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

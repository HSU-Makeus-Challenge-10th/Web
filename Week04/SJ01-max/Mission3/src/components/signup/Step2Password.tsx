import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema, type PasswordFormValues } from '../../lib/schemas';

interface Step2PasswordProps {
  email: string;
  onNext: (password: string) => void;
  onBack: () => void;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function Step2Password({ email, onNext, onBack }: Step2PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PasswordFormValues) => {
    onNext(data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm">
      {/* 뒤로가기 + 제목 */}
      <div className="relative flex items-center justify-center mb-6">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-0 text-white text-xl hover:text-pink-400 transition-colors"
          aria-label="뒤로 가기"
        >
          {'<'}
        </button>
        <h2 className="text-white text-lg font-medium">회원가입</h2>
      </div>

      {/* 이메일 표시 */}
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <span className="text-gray-400 text-sm">{email}</span>
      </div>

      {/* 비밀번호 */}
      <div className="mb-3">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력해주세요!"
            {...register('password')}
            className={`w-full bg-gray-900 border rounded-lg px-4 py-3 pr-10 text-white text-sm placeholder-gray-600 outline-none transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-700 focus:border-pink-500'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 pl-1">{errors.password.message}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="mb-3">
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="비밀번호를 다시 한 번 입력해주세요!"
            {...register('confirmPassword')}
            className={`w-full bg-gray-900 border rounded-lg px-4 py-3 pr-10 text-white text-sm placeholder-gray-600 outline-none transition-colors ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-700 focus:border-pink-500'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1 pl-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* 다음 버튼 */}
      <button
        type="submit"
        disabled={!isValid}
        className={`w-full rounded-lg py-3 text-sm font-medium transition-all ${
          isValid
            ? 'bg-pink-500 hover:bg-pink-400 text-white cursor-pointer'
            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </form>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { nicknameSchema, type NicknameFormValues, type AuthTokens } from '../../lib/schemas';
import { signUp } from '../../lib/authApi';
import useLocalStorage from '../../hooks/useLocalStorage';
import Input from '../common/Input';

interface Step3NicknameProps {
  email: string;
  password: string;
  onBack: () => void;
}

export default function Step3Nickname({ email, password, onBack }: Step3NicknameProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // useLocalStorage로 토큰 관리
  const [, setTokens] = useLocalStorage<AuthTokens | null>('auth_tokens', null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: NicknameFormValues) => {
    setIsLoading(true);
    setApiError('');
    try {
      await signUp({ name: data.nickname, email, password });
      // 회원가입 성공 후 토큰은 로그인 후 저장 — 여기서는 빈 토큰 초기화
      setTokens(null);
      navigate('/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setApiError(msg || '회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm">
      {/* 뒤로가기 + 제목 */}
      <div className="relative flex items-center justify-center mb-8">
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

      {/* 프로필 이미지 UI */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-16 h-16">
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* API 에러 메시지 */}
      {apiError && (
        <div className="mb-3 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-xs">
          {apiError}
        </div>
      )}

      {/* 닉네임 입력 */}
      <div className="mb-3">
        <Input
          type="text"
          placeholder="닉네임을 입력해주세요!"
          {...register('nickname')}
          error={errors.nickname?.message}
        />
      </div>

      {/* 회원가입 완료 버튼 */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`w-full rounded-lg py-3 text-sm font-medium transition-all ${
          isValid && !isLoading
            ? 'bg-pink-500 hover:bg-pink-400 text-white cursor-pointer'
            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
        }`}
      >
        {isLoading ? '처리 중...' : '회원가입 완료'}
      </button>
    </form>
  );
}

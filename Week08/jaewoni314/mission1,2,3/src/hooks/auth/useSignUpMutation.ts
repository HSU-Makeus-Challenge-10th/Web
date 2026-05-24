import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../apis/auth';
import type { SignUpRequestBody, SignUpResponse } from '../../types/auth/signup';

export const useSignUpMutation = () => {
  const navigate = useNavigate();

  return useMutation<SignUpResponse, Error, SignUpRequestBody>({
    mutationFn: signUp,
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
    },
  });
};

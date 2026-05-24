import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/authSchema';
import type { LoginFormValues } from '../../schemas/authSchema';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

export const useLogin = () => {
    const navigate = useNavigate();
    const { login, isLoggedIn } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onTouched',
    });

    useEffect(() => {
        if (isLoggedIn) navigate('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, navigate]);

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormValues) => {
            const response = await api.post('/v1/auth/signin', data);
            return response.data;
        },
        onSuccess: (data) => {
            const newAccessToken = data?.data?.accessToken || data?.accessToken;
            const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;

            if (newAccessToken && newRefreshToken) {
                login({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                });
                alert('로그인에 성공했습니다!');
                navigate('/');
            } else {
                throw new Error('토큰이 응답에 없습니다.');
            }
        },
        onError: (error) => {
            alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
            console.error('로그인 에러:', error);
        }
    });

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/v1/auth/google/login';
    };

    return {
        state: {
            errors,
            isValid,
            isPending: loginMutation.isPending,
        },
        actions: {
            register,
            handleSubmit,
            onSubmit,
            handleGoogleLogin,
            navigate,
        }
    };
};

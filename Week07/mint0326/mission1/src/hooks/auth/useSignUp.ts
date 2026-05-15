import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../../schemas/authSchema';
import type { SignUpFormValues } from '../../schemas/authSchema';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

export const useSignUp = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        mode: 'onTouched',
    });

    const emailValue = watch('email');
    const passwordValue = watch('password');
    const passwordConfirmValue = watch('passwordConfirm');
    const nicknameValue = watch('nickname');

    const handleNext = async () => {
        let isStepValid = false;

        if (step === 1) {
            isStepValid = await trigger('email');
            if (isStepValid) setStep(2);
        } else if (step === 2) {
            isStepValid = await trigger(['password', 'passwordConfirm']);
            if (isStepValid) setStep(3);
        } else if (step === 3) {
            isStepValid = await trigger('nickname');
            if (isStepValid) {
                await handleSubmit(onSubmit)();
            }
        }
    };

    const onSubmit = async (data: SignUpFormValues) => {
        try {
            const response = await api.post('/v1/auth/signup', {
                email: data.email,
                password: data.password,
                name: data.nickname,
            });

            const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
            const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;

            if (newAccessToken && newRefreshToken) {
                login({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                });
                alert('회원가입이 완료되었습니다!');
                navigate('/');
            } else {
                alert('회원가입이 완료되었습니다! 로그인해주세요.');
                navigate('/login');
            }
        } catch (error) {
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
            console.error('회원가입 에러:', error);
        }
    };

    const handleBack = () => {
        if (step === 3) {
            setStep(2);
        } else if (step === 2) {
            setStep(1);
        } else {
            navigate(-1);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return {
        state: {
            step,
            showPassword,
            showConfirmPassword,
            errors,
            isSubmitting,
            emailValue,
            passwordValue,
            passwordConfirmValue,
            nicknameValue,
        },
        actions: {
            handleNext,
            handleBack,
            togglePasswordVisibility,
            toggleConfirmPasswordVisibility,
            register,
            navigate,
        }
    };
};

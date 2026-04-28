import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import googleIcon from '../images/google_logo.png'
import default_avatar from '../images/default_avatar.png'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { signupSchema, type SignupFormFields } from "../utils/validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "../api/auth";
import { useState } from "react";
import Input from "../components/Input";

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<SignupFormFields>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordCheck: '',
        },
        resolver: zodResolver(signupSchema),
        mode: "onBlur"
    })

    const nextStep = async () => {
        if (step === 1) {
            const isValid = await trigger('email');
            if (isValid) setStep(2);
        } else if (step === 2) {
            const isValid = await trigger(['password', 'passwordCheck']);
            if (isValid) setStep(3);
        }
    }

    const onSubmit: SubmitHandler<SignupFormFields> = async (data) => {
        const { passwordCheck, ...rest } = data;

        try {
            await signup(rest);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="w-full max-w-85 mx-auto flex flex-col">
            <div className="flex items-center justify-center relative mb-8">
                <button onClick={() => navigate(-1)} className="absolute left-0 text-white hover:text-gray-300 transition-colors p-2 -ml-2 cursor-pointer">
                    <ChevronLeft />
                </button>
                <h2 className="text-white text-lg font-bold">
                    회원가입
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {step === 1 && (
                    <>
                        <button
                            type="button"
                            className="flex justify-center items-center gap-2 w-full py-3 px-4 rounded-[40px] border border-gray-100 bg-black text-white hover:bg-gray-900 transition-colors font-medium text-sm cursor-pointer"
                        >
                            <img src={googleIcon} alt="google icon" className="w-5 h-5" />
                            구글 로그인
                        </button>

                        <div className="flex items-center gap-4 my-2">
                            <div className="h-px bg-gray-600 flex-1"></div>
                            <span className="text-white text-xs font-medium">OR</span>
                            <div className="h-px bg-gray-600 flex-1"></div>
                        </div>

                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="이메일을 입력해주세요!"
                            errorMessage={errors.email?.message}
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <Input
                            {...register('password')}
                            type="password"
                            placeholder="비밀번호를 입력해주세요!"
                            errorMessage={errors.password?.message}
                        />

                        <Input
                            {...register('passwordCheck')}
                            type="password"
                            placeholder="비밀번호를 한번 더 입력해주세요!"
                            errorMessage={errors.passwordCheck?.message}
                        />
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="w-40 h-40 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden">
                                <img src={default_avatar} alt="Default Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <Input
                            {...register('name')}
                            type="text"
                            placeholder="이름을 입력해주세요!"
                            errorMessage={errors.name?.message}
                        />
                    </>
                )}

                <div className="flex gap-2 w-full mt-2">
                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="flex-1 bg-[#FF1E90] text-white rounded-md py-3 text-sm font-medium hover:bg-[#ff1e90] transition-colors cursor-pointer"
                        >
                            다음
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="flex-1 bg-[#FF1E90] text-white rounded-md py-3 text-sm font-medium hover:bg-[#ff1e90] transition-colors cursor-pointer disabled:bg-[#1f1f1f]"
                            disabled={isSubmitting}
                        >
                            회원가입 완료
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default SignupPage
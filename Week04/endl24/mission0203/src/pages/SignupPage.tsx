import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { postSignin, postSignup } from "../apis/auth";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { LoadingSpinner } from "../components/LoadingSpinner";
import axios from "axios";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordCheckValue = watch("passwordCheck");
  const nameValue = watch("name");
  useEffect(() => {
    if (passwordValue || passwordCheckValue) {
      trigger(["password", "passwordCheck"]);
    }
  }, [passwordValue, passwordCheckValue, trigger]);
  const isStep1Disabled = !!errors.email || !emailValue;
  const isStep2Disabled =
    !!errors.password ||
    !!errors.passwordCheck ||
    !passwordValue ||
    !passwordCheckValue ||
    passwordValue !== passwordCheckValue;
  const isStep3Disabled = !!errors.name || !nameValue;

  const togglePassword = () => setShowPassword((prev) => !prev);
  const togglePwCheck = () => setShowPwCheck((prev) => !prev);

  const handleNextStep = async (fields: (keyof FormFields)[]) => {
    const isValid = await trigger(fields);
    if (isValid) setStep((prev) => prev + 1);
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { email, password, name } = data;

    try {
      await postSignup({ email, password, name });
      const loginResponse = await postSignin({ email, password });

      const token = loginResponse.data.accessToken;

      if (token) {
        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, token);
        alert("회원가입 및 로그인이 완료되었습니다");
        window.location.replace("/");
      }
    } catch (error: unknown) {
      let errorMessage = "오류가 발생했습니다.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3 w-75">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-2">이메일을 입력해주세요</h2>
            <input
              {...register("email")}
              className={`border p-2 focus:border-[#807bff] rounded-md ${
                errors?.email ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              type="email"
              placeholder="이메일"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <button
              type="button"
              disabled={isStep1Disabled}
              onClick={() => handleNextStep(["email"])}
              className={`mt-2 w-full py-3 rounded-md font-medium transition-colors ${
                isStep1Disabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-2">비밀번호를 설정해주세요</h2>
            <div className="relative">
              <input
                {...register("password")}
                className={`border w-full p-2 focus:border-[#807bff] rounded-md ${
                  errors?.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-2 text-sm text-gray-500 cursor-pointer"
              >
                {showPassword ? "숨기기" : "보기"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <div className="relative">
              <input
                {...register("passwordCheck")}
                className={`border w-full p-2 focus:border-[#807bff] rounded-md ${
                  errors?.passwordCheck
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                type={showPwCheck ? "text" : "password"}
                placeholder="비밀번호 확인"
              />
              <button
                type="button"
                onClick={togglePwCheck}
                className="absolute right-2 top-2 text-sm text-gray-500 cursor-pointer"
              >
                {showPwCheck ? "숨기기" : "보기"}
              </button>
            </div>
            {errors.passwordCheck && (
              <p className="text-red-500 text-sm">
                {errors.passwordCheck.message}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-md cursor-pointer"
              >
                이전
              </button>
              <button
                type="button"
                disabled={isStep2Disabled}
                onClick={() => handleNextStep(["password", "passwordCheck"])}
                className={`flex-2 py-3 rounded-md font-medium transition-colors ${
                  isStep2Disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                다음
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-2">이름을 입력해주세요.</h2>
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-inner overflow-hidden">
                <svg
                  className="w-16 h-16 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <input
              {...register("name")}
              className={`border p-2 focus:border-[#807bff] rounded-md ${
                errors?.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              type="text"
              placeholder="이름"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-md cursor-pointer"
              >
                이전
              </button>
              <button
                type="button"
                disabled={isStep3Disabled || isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className={`flex-2 py-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  isStep3Disabled || isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <div className="scale-50">
                    <LoadingSpinner />
                  </div>
                ) : (
                  "회원가입 완료"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;

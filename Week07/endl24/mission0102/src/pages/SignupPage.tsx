import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFields } from "../utils/validate";
import { Input } from "../components/Input";
import { postSignup } from "../apis/auth";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(signupSchema),
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

  const handleNextStep = async (fields: (keyof SignupFields)[]) => {
    const isValid = await trigger(fields);
    if (isValid) setStep((prev) => prev + 1);
  };

  const onSubmit: SubmitHandler<SignupFields> = async (data) => {
    const { email, password, name } = data;

    try {
      await postSignup({ email, password, name });

      const isLoginSuccess = await login({ email, password });

      if (isLoginSuccess) {
        alert("회원가입 및 로그인이 완료되었습니다");
        navigate("/"); 
      } else {
        alert(
          "회원가입은 완료되었으나 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.",
        );
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
            <Input
              type="email"
              placeholder="이메일"
              registration={register("email")}
              error={errors.email}
            />
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

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              registration={register("password")}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={togglePassword}
                  className="text-sm text-gray-500 cursor-pointer"
                >
                  {showPassword ? "숨기기" : "보기"}
                </button>
              }
            />

            <Input
              type={showPwCheck ? "text" : "password"}
              placeholder="비밀번호 확인"
              registration={register("passwordCheck")}
              error={errors.passwordCheck}
              rightElement={
                <button
                  type="button"
                  onClick={togglePwCheck}
                  className="text-sm text-gray-500 cursor-pointer"
                >
                  {showPwCheck ? "숨기기" : "보기"}
                </button>
              }
            />

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

            <Input
              type="text"
              placeholder="이름"
              registration={register("name")}
              error={errors.name}
            />

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

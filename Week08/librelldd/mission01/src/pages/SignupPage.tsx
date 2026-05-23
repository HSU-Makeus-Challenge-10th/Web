import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm.ts";
import { postSignup } from "../apis/auth.ts";

/** 1. 폼 데이터 타입 정의 */
interface SignupFormValues {
  email: string;
  name: string;
  password: string;
  passwordCheck: string;
}

const SignupPage = () => {
  const navigate = useNavigate();


  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const { getInputProps, errors, touched, values } = useForm<SignupFormValues>({
    initialValue: {
      email: "",
      name: "",
      password: "",
      passwordCheck: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.email.includes("@")) errors.email = "이메일 형식이 아닙니다.";
      if (!values.name) errors.name = "이름을 입력해주세요.";
      if (values.password.length < 8) errors.password = "비밀번호는 8자 이상이어야 합니다.";
      if (values.password !== values.passwordCheck) errors.passwordCheck = "비밀번호가 일치하지 않습니다.";
      return errors;
    },
  });

  // 버튼 활성화 조건
  const isEmailValid = values.email.includes("@") && !errors.email;
  const isPasswordValid =
    values.password.length >= 8 &&
    values.password === values.passwordCheck &&
    !errors.passwordCheck;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await postSignup({
        email: values.email,
        name: values.name,
        password: values.password,
        passwordConfirm: values.passwordCheck,
        bio: "",
        avatar: ""
      });
      console.log(" 회원가입 완료:", response);
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      alert(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-gray-900 dark:bg-black dark:text-white font-sans transition-colors duration-300">



      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[360px]">


          <div className="relative flex items-center justify-center mb-10">
            <button
              onClick={() => (step === 1 ? setStep(0) : navigate(-1))}
              className="absolute left-0 text-xl font-light hover:text-gray-400"
            >
              〈
            </button>
            <h2 className="text-lg font-bold">회원가입</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* --- 1단계: 이메일 입력 --- */}
            {step === 0 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex items-center bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl p-4 focus-within:border-purple-600 transition-all">
                  <span className="mr-3 text-gray-500">✉️</span>
                  <input
                    {...getInputProps("email")}
                    className="bg-transparent w-full outline-none text-sm"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                {touched.email && errors.email && <p className="text-red-500 text-xs px-1">{errors.email}</p>}

                <div className="flex items-center bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl p-4">
                  <span className="mr-3 text-gray-500">👤</span>
                  <input
                    {...getInputProps("name")}
                    className="bg-transparent w-full outline-none text-sm"
                    placeholder="이름(닉네임)"
                  />
                </div>

                <button
                  type="button"
                  disabled={!isEmailValid || !values.name}
                  onClick={() => setStep(1)}
                  className={`w-full py-4 rounded-xl font-bold text-sm mt-4 transition-all shadow-lg ${isEmailValid && values.name ? "bg-purple-600 text-white shadow-purple-500/30" : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
                    }`}
                >
                  다음
                </button>
              </div>
            )}


            {step === 1 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                {/* 상단 고정 이메일 표시 */}
                <div className="flex items-center px-1 mb-2">
                  <span className="mr-3 text-sm text-gray-400">✉️</span>
                  <span className="text-sm font-medium">{values.email}</span>
                </div>

                {/* 비밀번호 필드 */}
                <div className="relative">
                  <input
                    {...getInputProps("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl outline-none text-sm focus:border-purple-600"
                    placeholder="비밀번호"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-500"
                  >

                  </button>
                </div>

                {/* 비밀번호 확인 필드 */}
                <div className="relative">
                  <input
                    {...getInputProps("passwordCheck")}
                    type={showConfirm ? "text" : "password"}
                    className="w-full p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl outline-none text-sm focus:border-purple-600"
                    placeholder="비밀번호 확인"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-4 text-gray-500"
                  >

                  </button>
                </div>
                {touched.passwordCheck && errors.passwordCheck && (
                  <p className="text-red-500 text-xs px-1">{errors.passwordCheck}</p>
                )}

                <button
                  type="submit"
                  disabled={!isPasswordValid}
                  className={`w-full py-4 rounded-xl font-bold text-sm mt-4 transition-all shadow-lg ${isPasswordValid ? "bg-purple-600 text-white shadow-purple-500/30" : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
                    }`}
                >
                  다음
                </button>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
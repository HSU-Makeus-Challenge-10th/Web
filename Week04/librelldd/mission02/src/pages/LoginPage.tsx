import { useNavigate } from "react-router-dom"; 
import type { UserSignInformation } from "../utils/validate.ts";
import { validateSignin } from "../utils/validate.ts";
import useForm from "../hooks/useForm.ts"; 

const LoginPage = () => {
  const navigate = useNavigate(); 

  const { getInputProps, errors, touched, values } = useForm<UserSignInformation>({
    initialValue: { 
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

  const handleLoginSubmit = () => {
    console.log("로그인 데이터 제출");
  };

  const isDisabled : boolean =
    Object.values(errors || {}).some((error: string) => error.length > 0) || 
    Object.values(values).some((value) => (value as string) === ""); 

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#000] text-white font-sans">
      
      {/* 상단 Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 border-b border-gray-900 bg-[#000]">
        <div className="text-purple-600 font-bold text-xl cursor-pointer">돌려돌려LP판</div>
        <ul className="flex gap-5 text-sm font-medium text-gray-500">
          <li className="text-purple-600 font-bold cursor-pointer">로그인</li>
          <li className="hover:text-white cursor-pointer transition-colors">회원가입</li>
        </ul>
      </nav>

      {/* 중앙 로그인 섹션 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-[320px]">
          
          {/* 타이틀 부분 (뒤로 가기) */}
          <div className="flex items-center justify-center relative mb-8">
            <span 
              onClick={() => navigate(-1)} 
              className="absolute left-0 cursor-pointer text-xl text-gray-600 hover:text-white transition-colors"
            >
              {"<"}
            </span>
            <h2 className="text-lg font-bold">로그인</h2>
          </div>

          {/* 구글 로그인 */}
          <button className="w-full border border-gray-800 rounded-md py-2.5 flex items-center justify-center gap-2 mb-6 hover:bg-gray-900 transition-colors">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-300">구글 로그인</span>
          </button>

          {/* OR 구분선 */}
          <div className="flex items-center gap-4 mb-6 text-gray-700">
            <div className="flex-1 h-[1px] bg-gray-800"></div>
            <span className="text-xs font-bold">OR</span>
            <div className="flex-1 h-[1px] bg-gray-800"></div>
          </div>

          {/* 입력 폼 (다연님 기존 로직 + 퍼플 디자인) */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <input
                {...getInputProps("email")} 
                className="bg-[#1a1a1a] border border-[#333] w-full p-3 focus:border-purple-500 rounded-md outline-none text-sm text-white"
                type="email"
                placeholder="이메일을 입력해주세요!"
              />
              {touched.email && errors.email && (
                <div className="text-red-500 text-xs mt-1">{errors.email}</div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <input
                {...getInputProps("password")} 
                className="bg-[#1a1a1a] border border-[#333] w-full p-3 focus:border-purple-500 rounded-md outline-none text-sm text-white"
                type="password"
                placeholder="비밀번호를 입력해주세요!"
              />
              {touched.password && errors.password && (
                <div className="text-red-500 text-xs mt-1">{errors.password}</div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLoginSubmit} 
              disabled={isDisabled}
              className="w-full bg-purple-900 text-white py-3 rounded-md text-sm font-medium mt-2 hover:bg-purple-700 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
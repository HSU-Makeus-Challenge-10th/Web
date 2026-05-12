import useForm from "../hooks/useForm";
import { validateSignin } from "../utils/validate";
import googleIcon from "../images/google_logo.png";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, accessToken } = useAuth();
  const from = location.state?.from || "/mypage";

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [accessToken, navigate, from]);

  const { values, error, getInputProps } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(values);
  };

  const handleGoogleLogin = () => {
    if (location.state?.from) {
      localStorage.setItem("redirectUrl", location.state.from);
    }
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(error || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="w-full max-w-md mx-auto flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-center relative mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 text-white hover:text-gray-300 transition-colors p-2 -ml-2 cursor-pointer"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-white text-lg font-bold">로그인</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex justify-center items-center gap-2 w-full py-3 px-4 rounded-[40px] border border-gray-100 bg-black text-white hover:bg-gray-900 transition-colors font-medium text-sm cursor-pointer"
        >
          <img src={googleIcon} alt="google icon" className="w-5 h-5" />
          구글 로그인
        </button>

        {/* OR 구분 선 */}
        <div className="flex items-center gap-4 my-2">
          <div className="h-px bg-gray-600 flex-1"></div>
          <span className="text-white text-xs font-medium">OR</span>
          <div className="h-px bg-gray-600 flex-1"></div>
        </div>

        {/* Email */}
        <Input
          {...getInputProps("email")}
          type="text"
          placeholder="이메일을 입력해주세요!"
          errorMessage={error?.email}
        />

        {/* Password */}
        <Input
          {...getInputProps("password")}
          type="password"
          placeholder="비밀번호를 입력해주세요!"
          errorMessage={error?.password}
        />

        {/* Login Button */}
        <button
          type="submit"
          className="bg-[#FF1E90] text-white rounded-md py-3 text-sm font-medium mt-2 hover:bg-[#ff1e90] transition-colors cursor-pointer disabled:bg-[#1f1f1f]"
          disabled={isDisabled}
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

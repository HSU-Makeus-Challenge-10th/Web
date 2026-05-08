import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { postSignin } from "../apis/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useEffect } from "react";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/my", { replace: true });
    }
  }, [accessToken, navigate]);

  const { setItem } = useLocalStorage("accessToken");

  const { getInputProps, errors, values } = useForm({
    initialValue: { email: "", password: "" },
    validate: (values: any) => {
      const errors: any = {};
      if (!values.email.includes("@")) {
        errors.email = "이메일 형식이 아닙니다.";
      }
      return errors;
    },
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 제출 시도:", values);
    console.log("현재 에러 상태:", errors);

    if (errors.email) {
      alert(errors.email);
      return;
    }

    try {
      await login({
        email: values.email,
        password: values.password,
      });

    } catch (error: any) {
      console.error("로그인 실패:", error);
      const serverMessage = error.response?.data?.message;
      alert(serverMessage || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white p-10 items-center justify-center">
      <div className="w-full max-w-[320px]">
        <h2 className="text-xl font-bold mb-6 text-purple-500 text-center">로그인</h2>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div>
            <input
              {...getInputProps("email")}
              className={`w-full p-3 bg-gray-900 border ${errors.email ? "border-red-500" : "border-gray-700"
                } rounded text-sm outline-none focus:border-purple-500`}
              placeholder="이메일"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <input
            {...getInputProps("password")}
            type="password"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-sm outline-none focus:border-purple-500"
            placeholder="비밀번호"
          />

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-bold rounded mt-4 hover:bg-purple-700 transition-colors"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">아직 계정이 없으신가요?</p>
          <button
            onClick={() => navigate("/signup")}
            className="text-purple-400 font-bold hover:underline text-sm"
          >
            회원가입하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
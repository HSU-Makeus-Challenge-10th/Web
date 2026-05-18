import { useNavigate, useLocation } from "react-router-dom";
import useForm from "../hooks/useForm.ts";
import { postSignin } from "../apis/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

const LoginPage = () => {
  const { handleLoginSuccess, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지 정보 가져오기
  const from = location.state?.from || "/";

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [accessToken, navigate, from]);

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

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: postSignin,
    onSuccess: async (response) => {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      if (newAccessToken && newRefreshToken) {
        await handleLoginSuccess(newAccessToken, newRefreshToken);
        alert("로그인 성공!");
        navigate(from, { replace: true });
      } else {
        alert("로그인에 실패했습니다. 서버 응답을 확인하세요.");
      }
    },
    onError: (error: any) => {
      console.error("로그인 실패:", error);
      const serverMessage = error.response?.data?.message;
      alert(serverMessage || "로그인 중 오류가 발생했습니다.");
    }
  });

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login"
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.email) {
      alert(errors.email);
      return;
    }

    loginMutate({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-gray-900 dark:bg-black dark:text-white p-10 items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-[320px]">
        <h2 className="text-xl font-bold mb-6 text-purple-600 dark:text-purple-500 text-center uppercase tracking-tighter">로그인</h2>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div>
            <input
              {...getInputProps("email")}
              className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border ${errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                } rounded-xl text-sm outline-none focus:border-purple-600 dark:focus:border-purple-500 transition-all`}
              placeholder="이메일"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
            )}
          </div>

          <input
            {...getInputProps("password")}
            type="password"
            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-purple-600 dark:focus:border-purple-500 transition-all"
            placeholder="비밀번호"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl mt-4 hover:bg-purple-700 disabled:bg-gray-400 transition-all shadow-lg shadow-purple-500/30"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-white text-black font-bold rounded mt-2 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <div className="flex items-center justify-center gap-4">
              <img src={"/images/google.svg"} />
              <span>구글 로그인</span>
            </div>

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
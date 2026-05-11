import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFields } from "../utils/validate";
import { Input } from "../components/Input";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// 💡 1. 우리가 만든 강력한 뮤테이션 훅을 불러옵니다.
import { useAuthMutations } from "../hooks/mutations/useAuthMutations"; 

const LoginPage = () => {
  const navigate = useNavigate();
  // 💡 2. 이제 여기서 login 함수를 꺼내지 않습니다. (accessToken만 사용)
  const { accessToken } = useAuth(); 
  // 💡 3. 뮤테이션 객체를 꺼내옵니다.
  const { loginMutation } = useAuthMutations(); 
  
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [navigate, accessToken, from]);

  const {
    register,
    handleSubmit,
    // 💡 4. isSubmitting 대신 뮤테이션의 isPending을 사용할 것이므로 제거합니다.
    formState: { errors, isValid }, 
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFields> = (data) => {
    // 💡 5. 대망의 변경 포인트! 이제 서버 요청은 뮤테이션이 전담합니다.
    // (성공 시 알아서 토큰을 저장하고 홈으로 이동시켜 줍니다.)
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  // 💡 6. 버튼 로딩 상태는 리액트 쿼리의 isPending으로 관리합니다.
  const isPending = loginMutation.isPending; 

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center h-full gap-4"
    >
      <div className="flex flex-col gap-3 w-75">
        <Input
          type="email"
          placeholder="이메일"
          registration={register("email")}
          error={errors.email}
        />

        <Input
          type="password"
          placeholder="비밀번호"
          registration={register("password")}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={!isValid || isPending}
          className="w-full h-14 bg-blue-600 text-white rounded-md text-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-300 cursor-pointer"
        >
          {isPending ? (
            <div className="scale-50">
              <LoadingSpinner />
            </div>
          ) : (
            "로그인"
          )}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isPending}
          className="w-full h-14 bg-white text-black border border-gray-300 rounded-md text-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center disabled:bg-gray-300 cursor-pointer"
        >
          {isPending ? (
            <div className="scale-50">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <img src={"images/google.svg"} alt="Google Logo" />
              <span>구글 로그인</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginPage;
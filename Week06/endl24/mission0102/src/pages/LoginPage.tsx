import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFields } from "../utils/validate";
import { Input } from "../components/Input";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, accessToken } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });;
    }
  }, [navigate, accessToken, from]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    const isSuccess = await login(data);
    if (isSuccess) {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

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
          disabled={!isValid || isSubmitting}
          className="w-full h-14 bg-blue-600 text-white rounded-md text-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-300 cursor-pointer"
        >
          {isSubmitting ? (
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
          disabled={isSubmitting}
          className="w-full h-14 bg-white text-black border border-gray-300 rounded-md text-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center disabled:bg-gray-300 cursor-pointer"
        >
          {isSubmitting ? (
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

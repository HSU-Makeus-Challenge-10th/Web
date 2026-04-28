import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
});

type LoginFields = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const {login, accessToken}=useAuth();
  useEffect(()=>{
    if(accessToken){
      navigate('/');
    }
  }, [navigate, accessToken]);
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
      navigate("/");
    }
  };

  const handleGoogleLogin = () =>{
    window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center h-full gap-4"
    >
      <div className="flex flex-col gap-3 w-75">
        <input
          {...register("email")}
          className={`border p-2 focus:border-[#807bff] rounded-md ${
            errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          type="email"
          placeholder="이메일"
        />
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
        )}

        <input
          {...register("password")}
          className={`border p-2 focus:border-[#807bff] rounded-md ${
            errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          type="password"
          placeholder="비밀번호"
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}

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
              <img src={'images/google.svg'}alt = "Google Logo"/>
              <span>구글 로그인</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginPage;

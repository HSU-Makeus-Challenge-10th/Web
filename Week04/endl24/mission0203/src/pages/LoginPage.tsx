import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { LoadingSpinner } from "../components/LoadingSpinner";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
});

type LoginFields = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    try {
      const response = await postSignin(data);

      const token = response.data.accessToken;

      if (token) {
        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, token);

        alert("로그인 되었습니다.");
        window.location.replace("/");
      }
    } catch (error: unknown) {
      console.error("로그인 실패:", error);
      let errorMessage = "로그인 중 오류가 발생했습니다.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
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
          type="button"
          onClick={handleSubmit(onSubmit)}
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
      </div>
    </div>
  );
};

export default LoginPage;

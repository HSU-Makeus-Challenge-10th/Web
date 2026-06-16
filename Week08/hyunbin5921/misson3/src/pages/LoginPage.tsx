import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

    const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/v1/auth/google/login"

      //  window.location.href = import.meta.env.VITE_SERVER_API_URL+ "/v1/auth/google/login"
      console.log("SERVER_API_URL:", import.meta.env.VITE_SERVER_API_URL)

    }

  const handleSubmit = async () => {
    try {
      await login(values);
      navigate("/my");
      console.log(values);
    } catch (error) {
      console.log("로그인 오류", error);
      alert("로그인 실패");
    }
  };
  //오류가 하나라도 있거나, 입력값이 비어있다면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || //오류 있으면 true
    Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${
              errors?.email && touched?.email
                ? "border-red-500 bg-red-200"
                : "border-gray-200"
            }`}
          type={"email"}
          placeholder={"이메일"}
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${
              errors?.password && touched?.password
                ? "border-red-500 bg-red-200"
                : "border-gray-200"
            }`}
          type={"password"}
          placeholder={"비밀번호"}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          로그인
        </button>
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          type="button"
          onClick={handleGoogleLogin}
          disabled={false}
        >
          <div className="flex items-center justify-center gap-5 ">
            <img className="w-5" src="../../public/images/google.png" alt="구글 로고 이미지" />
            <span>구글 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

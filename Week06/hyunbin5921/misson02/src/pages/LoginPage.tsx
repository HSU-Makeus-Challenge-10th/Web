import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useLocation, useNavigate } from "react-router-dom";

const REDIRECT_STORAGE_KEY = "postLoginRedirect";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const params = new URLSearchParams(loc.search);
  const redirect = params.get("redirect") || undefined;
  console.log("redirect param:", redirect);

  useEffect(() => {
    if (!accessToken) return;

    const stored = localStorage.getItem("postLoginRedirect") || undefined;
    const target = redirect ?? stored ?? "/"; // ✅ redirect > stored > 기본
    if (stored) localStorage.removeItem("postLoginRedirect");

    navigate(target, { replace: true });
  }, [accessToken, navigate, redirect]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    if (redirect) window.localStorage.setItem(REDIRECT_STORAGE_KEY, redirect);
    await login(values);
  };

  const handleGoogleLogin = async () => {
    window.localStorage.setItem(REDIRECT_STORAGE_KEY, redirect ?? "/");
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value == "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      LoginPage
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm text-white
            ${
              errors?.email && touched?.email
                ? "border-red-500 bg-red-200"
                : "border-gray-300"
            }`}
          type="email"
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 rounded-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm text-white
            ${
              errors?.password && touched?.password
                ? "border-red-500 bg-red-200"
                : "border-gray-300"
            }`}
          type="password"
          placeholder="비밀번호"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 rounded-sm">{errors.password}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          로그인
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          <div className="flex items-center justify-center gap-6">
            <img
              className="w-7 h-7"
              src={"/images/google.png"}
              alt="Google Logo Img"
            />
            <span>구글 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

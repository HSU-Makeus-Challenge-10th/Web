// import useForm from "../hooks/useForm";
// import { validateSignin, type UserSigninInformation } from "../utils/validate";
// import { Link, useLocation } from "react-router-dom";
// import type { RequestSigninDto } from "../types/auth";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// interface RequestSignInDto {
//   email: string;
//   password: string;
// }

// function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { values, errors, touched, getInputProps } =
//     useForm<UserSigninInformation>({
//       initialValue: {
//         email: "",
//         password: "",
//       },
//       validate: validateSignin,
//     });

//   const from = location.state?.from || "/";

//   const handleSubmit = async () => {
//     const success = await login(values as RequestSignInDto);

//     if (success) {
//       navigate(from, { replace: true });
//     }
//   };

//   const isDisabled =
//     Object.values(errors || {}).some((error) => error.length > 0) ||
//     Object.values(values).some((value) => value === "");

//   return (
//     <div className="flex flex-col items-center justify-center h-full gap-4 bg-black">
//       <div className="flex flex-col gap-3">
//         <div className="text-xl font-bold flex items-center justify-between relative py-5">
//           <Link to="/" className="cursor-pointer text-white">
//             &lt;
//           </Link>
//           <span className="absolute left-1/2 transform -translate-x-1/2 text-white">
//             로그인
//           </span>
//         </div>

//         <button
//           type="button"
//           disabled={false}
//           className="w-full text-white border border-gray-200 py-3 rounded-md text-lg font-medium transition-colors cursor-pointer hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed flex items-center justify-center relative"
//         >
//           <img
//             src="https://img.icons8.com/color/512/google-logo.png"
//             className="w-6 h-6 absolute left-4"
//           />
//           구글 로그인
//         </button>

//         <div className="relative flex justify-center py-5">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-700"></div>
//           </div>
//           <div className="relative bg-black px-10 text-sm text-white z-10">
//             OR
//           </div>
//         </div>
//         <input
//           {...getInputProps("email")}
//           className={`border border-[#ccc] w-[300px] p-[8px] rounded-sm placeholder:text-gray-400 text-white ${
//             errors?.email && touched?.email
//               ? "border-red-500 "
//               : "border-gray-300"
//           }`}
//           type={"email"}
//           placeholder="이메일을 입력해주세요!"
//         />
//         {errors?.email && touched?.email && (
//           <p className="text-sm text-red-500">{errors.email}</p>
//         )}
//         <input
//           {...getInputProps("password")}
//           className={`border border-[#ccc] w-[300px] p-[8px] rounded-sm placeholder:text-gray-400 text-white ${
//             errors?.password && touched?.password
//               ? "border-red-500"
//               : "border-gray-300"
//           }`}
//           type={"password"}
//           placeholder="비밀번호를 입력해주세요!"
//         />
//         {errors?.password && touched?.password && (
//           <div className="text-sm text-red-500">{errors.password}</div>
//         )}
//         <button
//           type="button"
//           onClick={handleSubmit}
//           disabled={isDisabled}
//           className="w-full bg-pink-500 text-gray-50 py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer disabled:bg-gray-900 disabled:cursor-not-allowed"
//         >
//           로그인
//         </button>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { postSignin } from "../apis/auth";
import type { RequestSignInDto, ResponseSigninDto } from "../types/auth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const from = location.state?.from || "/";

  const loginMutation = useMutation({
    mutationFn: (data: RequestSignInDto) => postSignin(data),
    onSuccess: (response: ResponseSigninDto) => {
      if (response.data) {
        const { accessToken, refreshToken, name } = response.data;

        login({ accessToken, refreshToken, name });

        navigate(from, { replace: true });
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
    },
  });

  const handleSubmit = async () => {
    loginMutation.mutate(values as RequestSignInDto);
  };

  const isDisabled =
    loginMutation.isPending ||
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-black">
      <div className="flex flex-col gap-3">
        <div className="text-xl font-bold flex items-center justify-between relative py-5">
          <Link to="/" className="cursor-pointer text-white">
            &lt;
          </Link>
          <span className="absolute left-1/2 transform -translate-x-1/2 text-white">
            로그인
          </span>
        </div>

        <button
          type="button"
          disabled={false}
          className="w-full text-white border border-gray-200 py-3 rounded-md text-lg font-medium transition-colors cursor-pointer hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed flex items-center justify-center relative"
        >
          <img
            src="https://img.icons8.com/color/512/google-logo.png"
            className="w-6 h-6 absolute left-4"
          />
          구글 로그인
        </button>

        <div className="relative flex justify-center py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative bg-black px-10 text-sm text-white z-10">
            OR
          </div>
        </div>

        <input
          {...getInputProps("email")}
          className={`border border-[#ccc] w-[300px] p-[8px] rounded-sm placeholder:text-gray-400 text-white ${
            errors?.email && touched?.email
              ? "border-red-500 "
              : "border-gray-300"
          }`}
          type={"email"}
          placeholder="이메일을 입력해주세요!"
        />
        {errors?.email && touched?.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] w-[300px] p-[8px] rounded-sm placeholder:text-gray-400 text-white ${
            errors?.password && touched?.password
              ? "border-red-500"
              : "border-gray-300"
          }`}
          type={"password"}
          placeholder="비밀번호를 입력해주세요!"
        />
        {errors?.password && touched?.password && (
          <div className="text-sm text-red-500">{errors.password}</div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-pink-500 text-gray-50 py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer disabled:bg-gray-900 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

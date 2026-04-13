import { useNavigate } from "react-router-dom"; 
import useForm from "../hooks/useForm.ts"; 
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { postSignin } from "../apis/auth.ts";

const LoginPage = () => {
  const navigate = useNavigate(); 
  const { setItem } = useLocalStorage("accessToken");

  const { getInputProps, errors, touched, values } = useForm({
    initialValue: { email: "", password: "" },
    validate: (values: any) => {
      const errors: any = {};
      if (!values.email.includes("@")) errors.email = "이메일 형식이 아닙니다.";
      return errors;
    },
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const response = await postSignin({
        email: values.email,
        password: values.password
      });
      
      const token = response?.result?.accessToken || (response as any)?.accessToken || (response as any)?.data?.accessToken || (response as any)?.token;
      if (token) {
        setItem(token);
        alert("로그인 성공!");
        navigate("/"); // 로그인 성공 시 홈으로
      } else {
        alert("로그인 응답 내용: " + JSON.stringify(response));
      }
    } catch (error: any) {
      console.error("로그인 실패:", error);
      alert(error.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white p-10 items-center justify-center">
      <div className="w-full max-w-[320px]">
        <h2 className="text-xl font-bold mb-6 text-purple-500 text-center">로그인</h2>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <input {...getInputProps("email")} className="p-3 bg-gray-900 border border-gray-700 rounded text-sm" placeholder="이메일" />
          <input {...getInputProps("password")} type="password" className="p-3 bg-gray-900 border border-gray-700 rounded text-sm" placeholder="비밀번호" />
          
          <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded mt-4">
            로그인
          </button>
        </form>

        {/* 💡 이 부분이 추가되었습니다! */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">아직 계정이 없으신가요?</p>
          <button 
            onClick={() => navigate("/signup")} // 클릭 시 /signup 경로로 이동
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
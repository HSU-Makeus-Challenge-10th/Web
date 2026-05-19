import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import type { RequestLogin } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function usePostLogin() {
  const { setAccessToken, setAccessTokenInStorage } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RequestLogin) => login(data),
    onSuccess: (response) => {
      if (response?.data?.accessToken) {
        const token = response.data.accessToken;
        setAccessTokenInStorage(token);
        setAccessToken(token);
        alert("로그인에 성공했습니다.");
        navigate("/");
        return;
      }
      setAccessToken(null);
      alert("로그인 응답이 올바르지 않습니다. 다시 시도해주세요.");
    },
    onError: (error) => {
      console.error(error);
      alert("로그인에 실패했습니다.");
    },
  });
}

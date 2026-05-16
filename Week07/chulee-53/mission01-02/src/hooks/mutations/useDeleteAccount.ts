import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawAccount } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useDeleteAccount() {
  const { setAccessToken, removeAccessTokenFromStorage } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawAccount,
    onSuccess: () => {
      alert("회원 탈퇴가 완료되었습니다.");
      removeAccessTokenFromStorage();
      setAccessToken(null);
      queryClient.clear();
      navigate("/login");
    },
    onError: (error) => {
      console.error(error);
      alert("회원 탈퇴에 실패했습니다.");
    }
  });
}

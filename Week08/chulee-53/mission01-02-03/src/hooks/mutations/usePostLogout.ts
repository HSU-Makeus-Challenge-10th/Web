import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function usePostLogout() {
  const { setAccessToken, removeAccessTokenFromStorage } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      removeAccessTokenFromStorage();
      setAccessToken(null);
      queryClient.clear();
      navigate("/");
    },
  });
}

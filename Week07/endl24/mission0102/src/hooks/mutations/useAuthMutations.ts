import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postSignin, postLogout, withdrawApi } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

export const useAuthMutations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, logout: clearAuthContext } = useAuth();

  // 로그인 Mutation
  const loginMutation = useMutation({
    mutationFn: postSignin,
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        login(accessToken, refreshToken);
        navigate("/");
      }
    },
    onError: (error) => {
      console.error("로그인 에러:", error);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    },
  });

  // 로그아웃 Mutation
  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      clearAuthContext(); // 1) 내 정보 및 토큰 비우기
      queryClient.clear(); // 2) 리액트 쿼리 캐시(다른 사람 글 등) 완전 삭제
      navigate("/login"); // 3) 로그인 페이지로 이동
    },
    onError: (error) => {
      console.error("로그아웃 에러:", error);
      clearAuthContext();
      queryClient.clear();
      navigate("/login");
    },
  });

  // 회원 탈퇴 Mutation
  const withdrawMutation = useMutation({
    mutationFn: withdrawApi,
    onSuccess: () => {
      alert("탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
      clearAuthContext(); // 1) 내 정보 비우기
      queryClient.clear(); // 2) 캐시 완전 삭제
      navigate("/login"); // 3) 로그인 페이지로 이동
    },
    onError: (error) => {
      console.error("탈퇴 에러:", error);
      alert("탈퇴 처리 중 문제가 발생했습니다.");
    },
  });

  return { loginMutation, logoutMutation, withdrawMutation };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, type UpdateProfileRequest } from "../../apis/user";
import { QUERY_KEY } from "../../constants/key";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onMutate: async (newData) => {
      // 1-1. 진행 중인 '내 정보 가져오기' 요청이 있다면 캔슬 (데이터 꼬임 방지)
      await queryClient.cancelQueries({ queryKey: QUERY_KEY.myInfo });

      // 1-2. 에러가 났을 때 돌아갈 '과거의 내 정보(백업본)'를 변수에 저장
      const previousMyInfo = queryClient.getQueryData(QUERY_KEY.myInfo);

      // 1-3. 일단 화면(캐시)부터 사용자가 입력한 새 데이터로 덮어씌움! (⚡️즉시 반영)
      // (기존 데이터 구조가 { data: { id, name, bio... } } 형태라고 가정)
      queryClient.setQueryData(QUERY_KEY.myInfo, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            name: newData.name,
            bio: newData.bio !== undefined ? newData.bio : oldData.data.bio,
            avatar:
              newData.avatar !== undefined
                ? newData.avatar
                : oldData.data.avatar,
          },
        };
      });

      // 1-4. 백업본을 밑에 있는 onError나 onSettled로 넘겨줌 (context로 전달됨)
      return { previousMyInfo };
    },
    onError: (error, newData, context) => {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패하여 이전 상태로 되돌립니다.");

      if (context?.previousMyInfo) {
        queryClient.setQueryData(QUERY_KEY.myInfo, context.previousMyInfo);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.myInfo });
    },
  });
};

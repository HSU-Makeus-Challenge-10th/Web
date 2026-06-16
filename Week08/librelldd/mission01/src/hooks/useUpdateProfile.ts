import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyProfile } from "../apis/auth";
import type { RequestUpdateProfileDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { user, updateUser } = useAuth();

    return useMutation({
        mutationFn: (body: RequestUpdateProfileDto) => patchMyProfile(body),
        onMutate: async (variables) => {
         
            await queryClient.cancelQueries({ queryKey: ["myInfo"] });
           
            const prevUser = user;
            const previousMyInfo = queryClient.getQueryData(["myInfo"]);

            if (user) {
                updateUser({
                    name: variables.name,
                    bio: variables.bio ?? user.bio,
                    avatar: variables.avatar ?? user.avatar,
                });
            }

            // 4. 캐시 데이터 낙관적 갱신
            queryClient.setQueryData(["myInfo"], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        name: variables.name,
                        bio: variables.bio ?? old.data.bio,
                        avatar: variables.avatar ?? old.data.avatar,
                    }
                };
            });

            // 5. 백업 컨텍스트 반환
            return { prevUser, previousMyInfo };
        },
        onError: (error, variables, context) => {
            console.error("프로필 수정 실패:", error);
            // 에러 발생 시 원래 상태로 복구
            if (context) {
                updateUser(context.prevUser);
                queryClient.setQueryData(["myInfo"], context.previousMyInfo);
            }
        },
        onSettled: () => {
            // 성공하든 실패하든 관계없이 무효화하여 최종 동기화
            queryClient.invalidateQueries({ queryKey: ["myInfo"] });
        },
    });
};

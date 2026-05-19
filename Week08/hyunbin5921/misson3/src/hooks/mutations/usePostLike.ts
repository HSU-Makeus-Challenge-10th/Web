import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { Likes, ResponseLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";


function usePostLike() {
  return useMutation({
    mutationFn: postLike,
        onMutate: async (lp) => {
          // 1.캐시된 데이터 요청 취소 시키기
          await queryClient.cancelQueries({
            queryKey: [QUERY_KEY.lps, lp.lpid],
          });
    
          // 2. 현재 데이터의 캐시 받아오기
          const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
            QUERY_KEY.lps,
            lp.lpid,
          ]);
    
          //  게시글 데이터 복사 -> NewLpPost에 새로운 객체 생성
          const newLpPost = { ...previousLpPost };
    
          // 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치 찾기
          const me = queryClient.getQueryData<ResponseMyInfoDto>([
            QUERY_KEY.myInfo,
          ]);
          const userId = Number(me?.data.id);
    
          const likedIndex =
            previousLpPost?.data.likes.findIndex(
              (like) => like.userId === userId
            ) ?? -1;
    
          if (likedIndex >= 0) {
            previousLpPost?.data.likes.splice(likedIndex, 1);
          } else {
            const newLike = { userId, lpId: lp.lpid } as Likes;
            previousLpPost?.data.likes.push(newLike);
          }
    
          // 업데이트된 게시글 캐시에 저장. -> 바로 UI 업뎃
          queryClient.setQueryData([QUERY_KEY.lps, lp.lpid], newLpPost);
    
          return { previousLpPost, newLpPost };
        },
        onError: (err, newLp, context) => {
          console.log(err, newLp);
          queryClient.setQueryData(
            [QUERY_KEY.lps, newLp.lpid],
            context?.previousLpPost?.data.id
          );
        },
        //onSettled는 API요청 끝 후 진행(성공이든 실패든)
        onSettled: async (data,error, variables, context) => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, variables.lpid]
            })
        }
      });

  };


export default usePostLike;

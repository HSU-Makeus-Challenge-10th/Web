import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpComment } from "../../api/comments";
import type { PaginationDto } from "../../types/common";


function useGetLpComment(lpId: number, paginationDto: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, paginationDto.cursor, paginationDto.limit, paginationDto.order],
    queryFn: () => getLpComment(lpId, paginationDto),
  });
}

export default useGetLpComment;

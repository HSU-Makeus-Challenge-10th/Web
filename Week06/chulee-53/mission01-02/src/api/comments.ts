import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import type { ResponseCommentList } from "../types/comments";

export const getLpComment = async (
  lpId: number,
  paginationDto: PaginationDto,
): Promise<ResponseCommentList> => {
  const { data } = await axiosInstance.get(`v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });

  return data;
};
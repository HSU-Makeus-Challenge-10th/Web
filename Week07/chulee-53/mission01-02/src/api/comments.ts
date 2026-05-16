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

export const postComment = async (
  lpId: number,
  body: { content: string }
): Promise<void> => {
  await axiosInstance.post(`v1/lps/${lpId}/comments`, body);
};

export const patchComment = async (
  lpId: number,
  commentId: number,
  body: { content: string }
): Promise<void> => {
  await axiosInstance.patch(`v1/lps/${lpId}/comments/${commentId}`, body);
};

export const deleteComment = async (
  lpId: number,
  commentId: number
): Promise<void> => {
  await axiosInstance.delete(`v1/lps/${lpId}/comments/${commentId}`);
};
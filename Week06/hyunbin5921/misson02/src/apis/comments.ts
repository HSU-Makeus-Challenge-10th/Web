import type { ResponseCommentsDto } from "../types/comment";
import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";

export const getComments = async (
  lpId: number,
  params: Omit<PaginationDto, "search"> = {} 
): Promise<ResponseCommentsDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, { params });
  return data;
};

export const postComment = async (lpId: number, body: { content: string }) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, body);
  return data;
};

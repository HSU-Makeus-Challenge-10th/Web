import { axiosInstance } from "./axios";

export const postComment = async (lpId: number, content: string) => {
  const response = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content: content,
  });
  return response.data;
};

export const updateComment = async (lpId: number, commentId: number, content: string) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
  return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
};
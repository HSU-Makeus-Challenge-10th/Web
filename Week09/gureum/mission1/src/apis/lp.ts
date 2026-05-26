import axiosInstance from './axios';
import type { PaginationParams } from '../types/common';
import type {
  CommentListResponse,
  CommentRequest,
  CreateLpRequest,
  LpDetailResponse,
  LpListResponse,
  UpdateLpRequest,
} from '../types/lp';

export const fetchLpList = async (params: PaginationParams = {}): Promise<LpListResponse> => {
  const { data } = await axiosInstance.get<LpListResponse>('/v1/lps', { params });
  return data;
};

export const fetchLpDetail = async (lpId: number): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.get<LpDetailResponse>(`/v1/lps/${lpId}`);
  return data;
};

export const fetchLpComments = async (
  lpId: number,
  params: PaginationParams = {},
): Promise<CommentListResponse> => {
  const { data } = await axiosInstance.get<CommentListResponse>(`/v1/lps/${lpId}/comments`, { params });
  return data;
};

export const createLp = async (body: CreateLpRequest): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.post<LpDetailResponse>('/v1/lps', body);
  return data;
};

export const updateLp = async (lpId: number, body: UpdateLpRequest): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.patch<LpDetailResponse>(`/v1/lps/${lpId}`, body);
  return data;
};

export const deleteLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}`);
};

export const likeLp = async (lpId: number): Promise<void> => {
  await axiosInstance.post(`/v1/lps/${lpId}/likes`);
};

export const unlikeLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
};

export const createComment = async (lpId: number, body: CommentRequest): Promise<void> => {
  await axiosInstance.post(`/v1/lps/${lpId}/comments`, body);
};

export const updateComment = async (lpId: number, commentId: number, body: CommentRequest): Promise<void> => {
  await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, body);
};

export const deleteComment = async (lpId: number, commentId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

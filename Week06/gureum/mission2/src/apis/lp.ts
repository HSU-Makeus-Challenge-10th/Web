import axiosInstance from './axios';
import type { PaginationParams } from '../types/common';
import type { CommentListResponse, LpDetailResponse, LpListResponse } from '../types/lp';

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

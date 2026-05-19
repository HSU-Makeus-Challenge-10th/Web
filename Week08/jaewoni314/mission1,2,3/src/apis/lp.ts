import { API, PrivateAPI } from './axios';
import type {
  CreateLpRequest,
  CreateLpResponse,
  DeleteLpResponse,
  GetLpsParams,
  GetLpsByTagParams,
  Lp,
  LpDetailResponse,
  LpPaginationData,
  UpdateLpRequest,
  UpdateLpResponse,
  LikeApiResponse,
} from '../types/lp';

export const getLps = async (params: GetLpsParams): Promise<LpPaginationData> => {
  const { data } = await API.get('/lps', { params });
  return data;
};

export const getLpsByTag = async (params: GetLpsByTagParams): Promise<LpPaginationData> => {
  const { tagName, ...queryParams } = params;
  const { data } = await API.get(`/lps/tag/${tagName}`, { params: queryParams });
  return data;
};

export const getLpDetail = async (lpId: number): Promise<Lp> => {
  const response = await PrivateAPI.get<LpDetailResponse>(`/lps/${lpId}`);
  return response.data;
};

export const createLp = async (lpData: CreateLpRequest): Promise<Lp> => {
  const response = await PrivateAPI.post<CreateLpResponse>('/lps', lpData);
  return response.data;
};

export const deleteLp = async (lpId: number): Promise<void> => {
  await PrivateAPI.delete<DeleteLpResponse>(`/lps/${lpId}`);
};

export const updateLp = async (lpId: number, lpData: UpdateLpRequest): Promise<Lp> => {
  const response = await PrivateAPI.patch<UpdateLpResponse>(`/lps/${lpId}`, lpData);
  return response.data;
};

// lp 좋아요
export const likeLp = async (lpId: number): Promise<void> => {
  await PrivateAPI.post<LikeApiResponse>(`/lps/${lpId}/likes`);
};

// lp 좋아요 취소
export const unlikeLp = async (lpId: number): Promise<void> => {
  await PrivateAPI.delete<LikeApiResponse>(`/lps/${lpId}/likes`);
};

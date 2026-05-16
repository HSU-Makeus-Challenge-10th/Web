import { API, PrivateAPI } from './axios';
import type {
  CreateLpRequest,
  CreateLpResponse,
  DeleteLpResponse,
  GetLpsParams,
  Lp,
  LpDetailResponse,
  LpPaginationData,
  UpdateLpRequest,
  UpdateLpResponse,
  LikeApiResponse,
} from '../types/lp';

//lp 목록 조회
export const getLps = async (params: GetLpsParams): Promise<LpPaginationData> => {
  const { data } = await API.get('/lps', { params });
  return data.data;
};

//lp 상세 정보 조회
export const getLpDetail = async (lpId: number): Promise<Lp> => {
  const response = await PrivateAPI.get<LpDetailResponse>(`/lps/${lpId}`);
  return response.data.data;
};

// lp 생성
export const createLp = async (lpData: CreateLpRequest): Promise<Lp> => {
  const response = await PrivateAPI.post<CreateLpResponse>('/lps', lpData);
  return response.data.data;
};

// lp 삭제
export const deleteLp = async (lpId: number): Promise<void> => {
  await PrivateAPI.delete<DeleteLpResponse>(`/lps/${lpId}`);
};

// lp 수정
export const updateLp = async (lpId: number, lpData: UpdateLpRequest): Promise<Lp> => {
  const response = await PrivateAPI.patch<UpdateLpResponse>(`/lps/${lpId}`, lpData);
  return response.data.data;
};

// lp 좋아요
export const likeLp = async (lpId: number): Promise<void> => {
  await PrivateAPI.post<LikeApiResponse>(`/lps/${lpId}/likes`);
};

// lp 좋아요 취소
export const unlikeLp = async (lpId: number): Promise<void> => {
  await PrivateAPI.delete<LikeApiResponse>(`/lps/${lpId}/likes`);
};

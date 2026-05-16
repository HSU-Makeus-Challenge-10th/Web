import { API, PrivateAPI } from './axios';
import type {
  CreateLpRequest,
  GetLpsParams,
  Lp,
  LpDetailResponse,
  UpdateLpRequest,
} from '../types/lp';

//lp 목록 조회
export const getLps = async (params: GetLpsParams) => {
  const { data } = await API.get('/lps', { params });
  return data.data;
};

//lp 상세 정보 조회
export const getLpDetail = async (lpId: number): Promise<Lp> => {
  const response = await PrivateAPI.get<LpDetailResponse>(`/lps/${lpId}`);
  return response.data.data;
};

// lp 생성
export const createLp = async (lpData: CreateLpRequest) => {
  const { data } = await PrivateAPI.post('/lps', lpData);
  return data;
};

// lp 삭제
export const deleteLp = async (lpId: number) => {
  const { data } = await PrivateAPI.delete(`/lps/${lpId}`);
  return data;
};

// lp 수정
export const updateLp = async (lpId: number, lpData: UpdateLpRequest) => {
  const { data } = await PrivateAPI.patch(`/lps/${lpId}`, lpData);
  return data;
};

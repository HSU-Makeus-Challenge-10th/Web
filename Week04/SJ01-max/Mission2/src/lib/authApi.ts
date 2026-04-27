import apiClient from './apiClient';

export interface SignInResponse {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export async function signIn(email: string, password: string): Promise<SignInResponse> {
  const res = await apiClient.post<ApiResponse<SignInResponse>>('/auth/signin', { email, password });
  return res.data.data;
}

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

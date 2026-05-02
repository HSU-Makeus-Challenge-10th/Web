import apiClient from './apiClient';

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

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

export async function signUp(payload: SignUpPayload) {
  const res = await apiClient.post<ApiResponse<unknown>>('/auth/signup', payload);
  return res.data.data;
}

export async function signIn(email: string, password: string): Promise<SignInResponse> {
  const res = await apiClient.post<ApiResponse<SignInResponse>>('/auth/signin', { email, password });
  return res.data.data;
}

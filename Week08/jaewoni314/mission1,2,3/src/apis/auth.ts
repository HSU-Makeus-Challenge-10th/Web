import { API, PrivateAPI } from './axios';
import type { SignUpRequestBody, SignUpResponse } from '../types/auth/signup';
import type { LoginData, LoginResponse } from '../types/auth/login';
import type { UpdateUserRequest, User } from '../types/auth/user';
import type { ApiResponse } from '../types/lp';

// 회원가입 API
export const signUp = async (data: SignUpRequestBody): Promise<SignUpResponse> => {
  const response = await API.post('/auth/signup', data);
  return response.data;
};

// 로그인 API
export const signIn = async (data: LoginData): Promise<LoginResponse> => {
  const response = await API.post('/auth/signin', data);
  return response.data;
};

// 로그아웃 API
export const signOut = async (): Promise<void> => {
  await PrivateAPI.post<ApiResponse<null>>('/auth/signout');
};

// 회원 탈퇴 API
export const deleteUser = async (): Promise<void> => {
  await PrivateAPI.delete<ApiResponse<null>>('/users');
};

export const getUserMe = async (): Promise<User> => {
  const response = await PrivateAPI.get<ApiResponse<User>>('/users/me');
  return response.data;
};

export const updateUser = async (
  data: UpdateUserRequest
): Promise<User> => {
  const response = await PrivateAPI.patch<ApiResponse<User>>('/users', data);
  return response.data;
};

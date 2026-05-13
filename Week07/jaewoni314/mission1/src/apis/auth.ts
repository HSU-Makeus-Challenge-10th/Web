import { API, PrivateAPI } from './axios';
import type { SignUpRequestBody, SignUpResponse } from '../types/auth/signup';
import type { LoginData, LoginResponse } from '../types/auth/login';
import type { UpdateUserRequest, User } from '../types/auth/user';

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
  await PrivateAPI.post('/auth/signout');
};

// 회원 탈퇴 API
export const deleteUser = async (): Promise<void> => {
  await PrivateAPI.delete('/users');
};

// 유저 정보 수정 API
export const updateUser = async (
  data: UpdateUserRequest
): Promise<{ data: User }> => {
  const response = await PrivateAPI.patch('/users', data);
  return response.data;
};

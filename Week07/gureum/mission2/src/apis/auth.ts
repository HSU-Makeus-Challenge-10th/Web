import axiosInstance from './axios';
import type { RequestSigninDto, RequestSignupDto, ResponseSigninDto, ResponseSignupDto, UserInfo } from '../types/auth';

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post<ResponseSigninDto>('/v1/auth/signin', body);
  return data;
};

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post<ResponseSignupDto>('/v1/auth/signup', body);
  return data;
};

export const postLogout = async (): Promise<void> => {
  await axiosInstance.post('/v1/auth/signout');
};

export const getMyInfo = async (): Promise<{ data: UserInfo }> => {
  const response = await axiosInstance.get<{ data: UserInfo }>('/v1/users/me');
  return response.data;
};

export const patchMyInfo = async (body: { name: string; bio?: string | null; avatar?: string | null }) => {
  const { data } = await axiosInstance.patch<{ data: UserInfo }>('/v1/users', body);
  return data;
};

export const deleteMe = async (): Promise<void> => {
  await axiosInstance.delete('/v1/users');
};

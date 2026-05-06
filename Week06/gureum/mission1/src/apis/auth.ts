import axiosInstance from './axios';
import type { RequestSigninDto, RequestSignupDto, ResponseSigninDto, ResponseSignupDto } from '../types/auth';

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post<ResponseSigninDto>('/v1/auth/signin', body);
  return data;
};

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post<ResponseSignupDto>('/v1/auth/signup', body);
  return data;
};

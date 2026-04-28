import { axiosInstance } from './axios';
import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseSigninDto,
  ResponseSignupDto,
  ResponseMyInfoDto,
} from '../types/auth';

// 로그인 API 래퍼: 페이지에서는 URL/axios 세부 구현을 몰라도 호출 가능
export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post('/v1/auth/signin', body);
  return data;
};

// 회원가입 API 래퍼
export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post('/v1/auth/signup', body);
  return data;
};

// 내 정보 조회 API 래퍼
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get('/v1/users/me');
  return data;
};

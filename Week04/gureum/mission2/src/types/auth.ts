import type { CommonResponse } from './common';

export interface RequestSigninDto {
  email: string;
  password: string;
}

export interface RequestSignupDto {
  email: string;
  password: string;
  name: string;
}

export type ResponseSigninDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

export type ResponseSignupDto = CommonResponse<{
  id: number;
  email: string;
  name: string;
}>;

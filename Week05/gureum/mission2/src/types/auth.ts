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

export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}>;

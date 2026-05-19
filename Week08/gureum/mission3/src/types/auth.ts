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

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

export type ResponseSigninDto = CommonResponse<{
  accessToken: string;
  refreshToken: string;
} & UserInfo>;

export type ResponseSignupDto = CommonResponse<UserInfo>;

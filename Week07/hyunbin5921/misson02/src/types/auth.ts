import type { CommonResponse } from "./common";

export type UserProfileData = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

// 회원가입
export type RequestSignupDto = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
};

export type ResponseSignupDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

export type RequestSignInDto = {
  email: string;
  password: string;
};

export type ResponseSigninDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

// 내 정보 조회
export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

export type UpdateMyInfoDto = {
  name: string;
  bio?: string | null;
  avatar?: string | null;
};

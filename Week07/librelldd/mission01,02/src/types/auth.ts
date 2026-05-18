import type { CommonResponse } from "./common.ts";

/** 1. 회원가입 */
export type RequestSignupDto = {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  password: string;
  passwordConfirm: string;
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


export type RequestLoginDto = {
  email: string;
  password: string;
};

export type ResponseLoginDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

/** 3. 내 정보 조회 */
export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

/** 5. 프로필 수정 */
export type RequestUpdateProfileDto = {
  name: string;
  bio?: string;
  avatar?: string;
};

export type ResponseUpdateProfileDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;
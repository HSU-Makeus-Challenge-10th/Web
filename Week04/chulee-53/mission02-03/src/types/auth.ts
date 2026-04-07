import type { CommonResponse } from "./common";

export type RequestSignup = {
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    password: string;
}

export type ResponseSignup = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}>

export type RequestLogin = {
    email: string;
    password: string;
}

export type ResponseLogin = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>

export type ResponseMyInfo = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}>
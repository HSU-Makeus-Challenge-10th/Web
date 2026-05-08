import { axiosInstance } from "./axios";

import type {
    RequestSignupDto,
    ResponseSignupDto,
    RequestLoginDto,
    ResponseLoginDto, 
    ResponseMyInfoDto
} from "../types/auth";

/** 1. 회원가입 */
export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);
    return data;
};

/** 2. 로그인 */
export const postSignin = async (body: RequestLoginDto): Promise<ResponseLoginDto> => {
    console.log("로그인 요청 데이터:", body);
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
};

/** 3. 내 정보 조회 */
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get("/v1/users/me", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

/** 4. 로그아웃 */
export const postSignout = async () => {
    
    const response = await axiosInstance.post("/v1/auth/signout");
    return response.data;
};


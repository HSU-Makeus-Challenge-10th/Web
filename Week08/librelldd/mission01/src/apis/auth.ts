import { axiosInstance } from "./axios";

import type {
    RequestSignupDto,
    ResponseSignupDto,
    RequestLoginDto,
    ResponseLoginDto,
    ResponseMyInfoDto,
    RequestUpdateProfileDto,
    ResponseUpdateProfileDto
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
    const { data } = await axiosInstance.get("/v1/users/me");
    return data;
};

/** 4. 로그아웃 */
export const postSignout = async () => {
    const response = await axiosInstance.post("/v1/auth/signout");
    return response.data;
};

/** 5. 프로필 수정 */
export const patchMyProfile = async (body: RequestUpdateProfileDto): Promise<ResponseUpdateProfileDto> => {
    const { data } = await axiosInstance.patch("/v1/users", body);
    return data;
};

/** 6. 회원 탈퇴 */
export const deleteAccount = async (): Promise<any> => {
    const { data } = await axiosInstance.delete("/v1/users");
    return data;
};


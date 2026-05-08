import { axiosInstance } from "./axios";

import type {
    RequestSignupDto,
    ResponseSignupDto,
    RequestLoginDto,
    ResponseLoginDto, // 여기서 가져오는 타입이 우선순위를 가집니다.
    ResponseMyInfoDto
} from "../types/auth";

/** 1. 회원가입 */
export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);
    return data;
};

/** 2. 로그인 */
export const postSignin = async (body: RequestLoginDto): Promise<ResponseLoginDto> => {
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
    // 사용하지 않는 { data } 할당을 제거하여 경고 방지
    const response = await axiosInstance.post("/v1/auth/signout");
    return response.data;
};

// 파일 하단에 있던 "export interface ResponseLoginDto" 부분은 삭제하세요!
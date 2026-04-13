import { axiosInstance } from "./axios"; // 1. axiosInstance를 가져옵니다.
import type { 
    RequestSignupDto, 
    ResponseSignupDto, 
    RequestLoginDto, 
    ResponseLoginDto, 
    ResponseMyInfoDto
} from "../types/auth";

/** 회원가입 */
export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);
    return data;
};

/** 로그인 */
// 2. RequestSigninDto -> RequestLoginDto로 이름을 통일합니다.
// 3. ResponseSigninDto -> ResponseLoginDto로 이름을 통일합니다.
export const postSignin = async (body: RequestLoginDto): Promise<ResponseLoginDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
};

export const getMyInfo = async ():Promise<ResponseMyInfoDto> => {
    const {data} = await axiosInstance.get("/V1/users/me", {
        headers: {
            Authorization:'Bearer'
        }
    });

    return data;
}
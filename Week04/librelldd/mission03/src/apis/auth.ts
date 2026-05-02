import { axiosInstance } from "./axios";
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


export const postSignin = async (body: RequestLoginDto): Promise<ResponseLoginDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get("/V1/users/me", {
        headers: {
            Authorization: 'Bearer'
        }
    });

    return data;
}
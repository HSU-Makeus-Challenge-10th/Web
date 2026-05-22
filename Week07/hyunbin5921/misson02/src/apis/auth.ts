import type {
  RequestSignupDto,
  ResponseSignupDto,
  RequestSigninDto,
  ResponseSigninDto,
  ResponseMyInfoDto,
  UpdateMyInfoDto,
  CommonResponse,
} from "../types/auth";

import { axiosInstance } from "./axios";

export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me", {});
  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};

export const updateMyInfo = async (
  data: UpdateMyInfoDto
): Promise<CommonResponse<ResponseMyInfoDto["data"]>> => {
  const response = await axiosInstance.patch<
    CommonResponse<ResponseMyInfoDto["data"]>
  >("/v1/users", data);
  return response.data;
};

export const deleteUser = async (): Promise<CommonResponse<{}>> => {
  const response = await axiosInstance.delete<CommonResponse<{}>>("/v1/users");
  return response.data;
};

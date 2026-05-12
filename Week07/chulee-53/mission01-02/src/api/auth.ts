import type {
  RequestLogin,
  RequestSignup,
  ResponseLogin,
  ResponseMyInfo,
  ResponseSignup,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const signup = async (body: RequestSignup): Promise<ResponseSignup> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const login = async (body: RequestLogin): Promise<ResponseLogin> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfo> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};

export const patchMyInfo = async (body: { name?: string; bio?: string; avatar?: string }): Promise<void> => {
  await axiosInstance.patch("/v1/users", body);
};

export const logout = async (): Promise<void> => {
  await axiosInstance.delete("/v1/auth/signout");
  return;
};

export const withdrawAccount = async (): Promise<void> => {
  await axiosInstance.delete("/v1/users");
  return;
};


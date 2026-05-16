import type { PaginationDto } from "../types/common";
import type { Lp, ResponseLikeLpDto, ResponseLpList, RequestCreateLp, ResponseLp } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpList> => {
  const { data } = await axiosInstance.get("v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLikedLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpList> => {
  const { data } = await axiosInstance.get("v1/lps/likes/me", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (id: number): Promise<Lp> => {
  const { data } = await axiosInstance.get(`v1/lps/${id}`);
  return data;
};

export const postLike = async (id: number): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`v1/lps/${id}/likes`);
  return data;
};

export const deleteLike = async (id: number): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`v1/lps/${id}/likes`);
  return data;
};

export const postLp = async (body: RequestCreateLp): Promise<ResponseLp> => {
  const { data } = await axiosInstance.post(`v1/lps`, body);
  return data;
};

export const deleteLp = async (id: number): Promise<void> => {
  await axiosInstance.delete(`v1/lps/${id}`);
};

import type { PaginationDto } from "../types/common";
import type {
  RequestLpDto,
  ResponseLpDto,
  ResponseLpListDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  PaginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: PaginationDto,
  });

  return data;
};

export const getLpDetail = async (lpid: number): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data;
};

export const postLike = async ({ lpId }: RequestLpDto) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async ({ lpId }: RequestLpDto) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

export const postLp = async (requestData: RequestLpDto) => {
  const { data } = await axiosInstance.post(`/v1/lps`, requestData);
  return data;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const updateLp = async (lpId: number, data: RequestLpDto) => {
  const response = await axiosInstance.patch(`/v1/lps/${lpId}`, data);
  return response.data;
};

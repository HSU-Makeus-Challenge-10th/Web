import type { PaginationDto } from "../types/common";
import type { ResponseLpList } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpList> => {
  const { data } = await axiosInstance.get("v1/lps", {
    params: paginationDto,
  });

  return data;
};

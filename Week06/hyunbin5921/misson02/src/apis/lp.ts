import type { PaginationDto } from "../types/common";
import type { ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async(paginaitionDto: PaginationDto): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get('v1/lps', {
        params:paginaitionDto
    })

    return data
}

export const getLpDetail = async (id: number): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};
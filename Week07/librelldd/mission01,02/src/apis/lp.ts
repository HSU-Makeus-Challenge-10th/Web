import { type PaginationDto } from "../types/common";
import type { ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";


export const getLPList = async (
    paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });
    return data;
}

export const getLPDetail = async (id: string | number): Promise<{ data: any }> => {
    const { data } = await axiosInstance.get(`/v1/lps/${id}`);
    return data;
}

export const getLPComments = async (
    lpId: string | number,
    paginationDto: PaginationDto,
): Promise<any> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: paginationDto,
    });
    return data;
}

export const createComment = async (
    lpId: string | number,
    content: string,
): Promise<any> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
        content,
    });
    return data;
}

export const patchComment = async (
    lpId: string | number,
    commentId: string | number,
    content: string,
): Promise<any> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, {
        content,
    });
    return data;
}

export const deleteComment = async (
    lpId: string | number,
    commentId: string | number,
): Promise<any> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
    return data;
}

/** LP 생성 */
export type CreateLpRequest = {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
};

export const postLp = async (body: CreateLpRequest): Promise<any> => {
    const { data } = await axiosInstance.post("/v1/lps", body);
    return data;
}

/** LP 수정 */
export const patchLp = async (id: string | number, body: Partial<CreateLpRequest>): Promise<any> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${id}`, body);
    return data;
}

/** LP 삭제 */
export const deleteLp = async (id: string | number): Promise<any> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${id}`);
    return data;
}

/** LP 좋아요 */
export const postLpLike = async (id: string | number): Promise<any> => {
    const { data } = await axiosInstance.post(`/v1/lps/${id}/likes`, {});
    return data;
}

/** LP 좋아요 취소 */
export const deleteLpLike = async (id: string | number): Promise<any> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${id}/likes`);
    return data;
}

/** 이미지 업로드 */
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axiosInstance.post("/v1/uploads/public", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data.data.imageUrl;
}
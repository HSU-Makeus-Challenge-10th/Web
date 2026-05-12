import { axiosInstance } from "./axios";
import type {
  PaginationDto,
  CommonResponse,
  CursorBasedResponse,
} from "../types/common";
import type {
  Comment,
  LpItem,
  ResponseCommentDetailDto,
  ResponseDeleteCommentDto,
  CreateCommentDto,
  UpdateCommentDto,
  ResponseLpListDto,
  ResponseLpDetailDto,
  ResponseDeleteLpDto,
  CreateLpDto,
  UpdateLpDto,
} from "../types/lp";

const LP_API_PREFIX = "/v1/lps";

/**
 * [GET] Lp 목록 조회 (전체, 페이지네이션)
 */
export const getLpList = async (
  paginationDto: PaginationDto = {} // 기본값 설정
): Promise<ResponseLpListDto> => {
  // paginationDto에는 order (asc/desc), limit, cursor 등이 포함됩니다.
  const { data } = await axiosInstance.get(LP_API_PREFIX, {
    params: paginationDto,
  });
  return data;
};

/**
 * [GET] 특정 유저의 Lp 목록 조회
 */
export const getLpListByUser = async (
  userId: number,
  paginationDto: PaginationDto = {}
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get(`${LP_API_PREFIX}/user/${userId}`, {
    params: paginationDto,
  });
  return data;
};

/**
 * [GET] 내 Lp 목록 조회
 */
export const getMyLpList = async (
  paginationDto: PaginationDto = {}
): Promise<ResponseLpListDto> => {
  // 인증이 필요하므로 axiosInstance가 토큰을 자동으로 붙여야 함
  const { data } = await axiosInstance.get(`${LP_API_PREFIX}/user`, {
    params: paginationDto,
  });
  return data;
};

/**
 * [GET] Lp 상세 정보 조회
 */
export const getLpDetail = async (lpId: number): Promise<LpItem> => {
  // 응답 타입은 ResponseLpDetailDto (CommonResponse<{ data: LpItem }>)를 사용합니다.
  const response = await axiosInstance.get<ResponseLpDetailDto>(
    `${LP_API_PREFIX}/${lpId}`
  );

  const lpItem = response.data?.data;

  // 🚨 LP 데이터가 명확하게 없거나 null인 경우만 에러를 발생시킵니다.
  if (!lpItem) {
    console.error(
      `ERROR: LP ID ${lpId}에 해당하는 상세 데이터가 응답 data 필드에 없습니다.`,
      response.data
    );
    throw new Error(`LP ID ${lpId}에 해당하는 정보를 찾을 수 없습니다.`);
  }

  return lpItem;
};

/**
 * [POST] 새로운 Lp 생성
 */
export const createLp = async (
  lpData: CreateLpDto
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.post(LP_API_PREFIX, lpData);
  return data;
};

/**
 * [PATCH] 특정 Lp의 정보를 업데이트합니다.
 */
export const updateLp = async (
  lpId: number,
  lpData: UpdateLpDto
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.patch(
    `${LP_API_PREFIX}/${lpId}`,
    lpData
  );
  return data;
};

/**
 * [DELETE] 특정 Lp 삭제
 */
export const deleteLp = async (lpId: number): Promise<ResponseDeleteLpDto> => {
  const { data } = await axiosInstance.delete(`${LP_API_PREFIX}/${lpId}`);
  return data;
};

// lpId, cursor, limit 등을 사용하여 댓글을 가져와야 합니다.

export const getLpComments = async (
  lpId: number,
  queryOptions?: { limit?: number; cursor?: number; order?: string }
  // 🚨 반환 타입을 ResponseCommentListDto 대신 CursorBasedResponse<Comment[]>로 명시
): Promise<CursorBasedResponse<Comment[]>> => {
  const url = `/v1/lps/${lpId}/comments`;

  const { data } = await axiosInstance.get<CursorBasedResponse<Comment[]>>(
    url,
    {
      params: queryOptions,
    }
  );

  return data;
};

export const createComment = async (
  lpId: number,
  data: CreateCommentDto
): Promise<Comment> => {
  // POST /v1/lps/{lpId}/comments
  const response = await axiosInstance.post<ResponseCommentDetailDto>(
    `/v1/lps/${lpId}/comments`,
    data
  );
  // 스웨거 응답 구조가 { id, content, ... } 형태이므로 CommonResponse의 data 필드 전체를 반환
  return response.data.data;
};

/**
 * [PATCH] 댓글 수정 (lpId, commentId 필요)
 */
export const updateComment = async (
  lpId: number,
  commentId: number,
  data: UpdateCommentDto
): Promise<Comment> => {
  // PATCH /v1/lps/{lpId}/comments/{commentId}
  // 스웨거 응답 구조가 CommonResponse<{ data: { id, content, ... } }> 형태를 따르는 것으로 추정하고 data 필드 안의 data를 반환
  const response = await axiosInstance.patch<CommonResponse<{ data: Comment }>>(
    `/v1/lps/${lpId}/comments/${commentId}`,
    data
  );
  return response.data.data.data; // CommonResponse.data.data 반환
};

/**
 * [DELETE] 댓글 삭제 (lpId, commentId 필요)
 */
export const deleteComment = async (
  lpId: number,
  commentId: number
): Promise<{ message: string }> => {
  // DELETE /v1/lps/{lpId}/comments/{commentId}
  const response = await axiosInstance.delete<
    CommonResponse<{ message: string }>
  >(`/v1/lps/${lpId}/comments/${commentId}`);
  return response.data.data; // { message: "댓글이 삭제되었습니다." } 반환
};

interface ResponseLikeDetail {
  id: number;
  userId: number;
  lpId: number;
}
/**
 * [POST] 특정 Lp에 좋아요를 추가합니다.
 */
export const addLpLike = async (lpId: number): Promise<ResponseLikeDetail> => {
  // 응답 구조가 CommonResponse<{ data: ResponseLikeDetail }> 형태라고 가정
  const response = await axiosInstance.post<CommonResponse<ResponseLikeDetail>>(
    `${LP_API_PREFIX}/${lpId}/likes`
  );
  return response.data.data;
};

/**
 * [DELETE] 특정 Lp의 좋아요를 취소합니다.
 */
export const removeLpLike = async (
  lpId: number
): Promise<{ message: string }> => {
  // 응답 구조가 CommonResponse<{ message: string }> 형태라고 가정
  const response = await axiosInstance.delete<
    CommonResponse<{ message: string }>
  >(`${LP_API_PREFIX}/${lpId}/likes`);
  return response.data.data;
};

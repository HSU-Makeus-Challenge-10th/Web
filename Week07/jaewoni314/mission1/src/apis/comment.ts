import { PrivateAPI } from './axios';
import type {
  CommentListResponse,
  CommentPaginationData,
  GetCommentsParams,
  CreateCommentParams,
  CreateCommentResponse,
  UpdateCommentParams,
  UpdateCommentResponse,
  DeleteCommentParams,
  DeleteCommentResponse,
} from '../types/comment';

//lp 댓글 조회
export const getLpComments = async ({
  lpId,
  cursor = 0,
  limit = 10,
  order = 'asc',
}: GetCommentsParams): Promise<CommentPaginationData> => {
  const response = await PrivateAPI.get<CommentListResponse>(
    `/lps/${lpId}/comments`,
    {
      params: { cursor, limit, order },
    }
  );
  return response.data.data;
};

// 댓글 작성
export const createComment = async ({
  lpId,
  content,
}: CreateCommentParams): Promise<CreateCommentResponse> => {
  const response = await PrivateAPI.post<CreateCommentResponse>(
    `/lps/${lpId}/comments`,
    { content }
  );
  return response.data;
};

// 댓글 수정
export const updateComment = async ({
  lpId,
  commentId,
  content,
}: UpdateCommentParams): Promise<UpdateCommentResponse> => {
  const response = await PrivateAPI.patch<UpdateCommentResponse>(
    `/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return response.data;
};

// 댓글 삭제
export const deleteComment = async ({
  lpId,
  commentId,
}: DeleteCommentParams): Promise<DeleteCommentResponse> => {
  const response = await PrivateAPI.delete<DeleteCommentResponse>(
    `/lps/${lpId}/comments/${commentId}`
  );
  return response.data;
};

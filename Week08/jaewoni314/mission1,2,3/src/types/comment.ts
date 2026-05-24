import type { ApiResponse, Author } from './lp';

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export interface CommentPaginationData {
  data: Comment[];
  nextCursor: number;
  hasNext: boolean;
}

export type CommentListResponse = ApiResponse<CommentPaginationData>;

export interface GetCommentsParams {
  lpId: number;
  cursor?: number;
  limit?: number;
  order?: 'asc' | 'desc';
}

// 댓글 작성
export interface CreateCommentParams {
  lpId: number;
  content: string;
}

export interface CreateCommentResponse {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

// 댓글 수정
export interface UpdateCommentParams {
  lpId: number;
  commentId: number;
  content: string;
}

export type UpdateCommentResponse = ApiResponse<Comment>;

// 댓글 삭제
export interface DeleteCommentParams {
  lpId: number;
  commentId: number;
}

export interface DeleteCommentData {
  message: string;
}

export type DeleteCommentResponse = ApiResponse<DeleteCommentData>;

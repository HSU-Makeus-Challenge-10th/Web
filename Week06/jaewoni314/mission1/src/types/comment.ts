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

import { PrivateAPI } from './axios';
import type {
  CommentListResponse,
  CommentPaginationData,
  GetCommentsParams,
} from '../types/comment';

//lp 댓글 조회
export const getLpComments = async ({
  lpId,
  cursor = 0,
  limit = 10,
  order = 'asc',
}: GetCommentsParams): Promise<CommentPaginationData> => {
  const response = await PrivateAPI.get<CommentListResponse>(
    `v1/lps/${lpId}/comments`,
    {
      params: { cursor, limit, order },
    }
  );
  return response.data.data;
};

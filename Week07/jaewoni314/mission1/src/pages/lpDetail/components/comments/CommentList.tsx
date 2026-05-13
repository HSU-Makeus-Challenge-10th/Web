import CommentItem from './CommentItem';
import CommentItemSkeleton from './CommentItemSkeleton';
import type { Comment } from '../../../../types/comment';

interface CommentListProps {
  comments?: Array<{ data: Comment[] }>;
  lpId: number;
  isLoading: boolean;
}

const CommentList = ({ comments, lpId, isLoading }: CommentListProps) => {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <CommentItemSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <>
      {comments?.map((page) =>
        page.data.map((comment) => (
          <CommentItem key={comment.id} comment={comment} lpId={lpId} />
        ))
      )}
    </>
  );
};

export default CommentList;

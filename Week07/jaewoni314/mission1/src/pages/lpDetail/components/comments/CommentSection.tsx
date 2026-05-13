import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLpComments } from '../../../../hooks/comment/useLpComments';
import { useCreateComment } from '../../../../hooks/comment/useCreateComment';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import CommentItemSkeleton from './CommentItemSkeleton';
import Error from '../../../../components/error/Error';
import OrderSelector from '../../../../components/orderSelector/OrderSelector';

interface CommentSectionProps {
  lpId: number;
}

const CommentSection = ({ lpId }: CommentSectionProps) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useLpComments({ lpId, order });

  const { mutate: createCommentMutation, isPending: isCreating } =
    useCreateComment();

  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleCreateComment = (content: string) => {
    createCommentMutation({ lpId, content });
  };

  if (isError) {
    return <Error message={error.message} />;
  }

  return (
    <div className="mt-[5vh] pt-[3vh] border-t border-gray-700">
      <h2 className="text-[1.8vw] font-bold mb-[2vh]">댓글</h2>

      <CommentForm onSubmit={handleCreateComment} isCreating={isCreating} />

      <OrderSelector order={order} onOrderChange={setOrder} />

      <div>
        <CommentList comments={data?.pages} lpId={lpId} isLoading={isLoading} />
      </div>

      <div ref={ref} className="h-10" />

      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, index) => (
          <CommentItemSkeleton key={index} />
        ))}
    </div>
  );
};

export default CommentSection;

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLpComments } from '../../../../hooks/useLpComments';
import CommentItem from './CommentItem';
import CommentItemSkeleton from './CommentItemSkeleton';
import Error from '../../../../components/error/Error';
import Button from '../../../../components/button/Button';
import Input from '../../../../components/input/Input';
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

  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isError) {
    return <Error message={error.message} />;
  }

  return (
    <div className="mt-[5vh] pt-[3vh] border-t border-gray-700">
      <h2 className="text-[1.8vw] font-bold mb-[2vh]">댓글</h2>

      <div className="flex gap-[1vw] mb-[3vh]">
        <Input type="text" placeholder="댓글을 입력해주세요" disabled />
        <div className="whitespace-nowrap">
          <Button variant="secondary" size="md" disabled>
            작성
          </Button>
        </div>
      </div>

      <OrderSelector order={order} onOrderChange={setOrder} />

      <div>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <CommentItemSkeleton key={index} />
            ))
          : data?.pages.map((page) =>
              page.data.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            )}
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

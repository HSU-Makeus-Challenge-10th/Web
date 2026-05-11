import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQueryClient } from '@tanstack/react-query';
import { useLpComments } from '../../../../hooks/useLpComments';
import { PrivateAPI } from '../../../../apis/axios';
import CommentItem from './CommentItem';
import CommentItemSkeleton from './CommentItemSkeleton';
import Error from '../../../../components/error/Error';
import Button from '../../../../components/button/Button';
import OrderSelector from '../../../../components/orderSelector/OrderSelector';

interface CommentSectionProps {
  lpId: number;
}

const CommentSection = ({ lpId }: CommentSectionProps) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useLpComments({ lpId, order });

  // ✅ rootMargin으로 미리 감지, threshold 낮게
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await PrivateAPI.post(`v1/lps/${lpId}/comments`, { content });
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, order] });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isError) return <Error message={error.message} />;

  return (
    <div>
      <h2 className="text-[1.8vw] font-bold mb-[2vh]">댓글</h2>

      {/* 댓글 작성란 */}
      <div className="flex gap-[1vw] mb-[3vh]">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="댓글을 입력해주세요"
          className="flex-1 bg-black text-white rounded border border-gray-600 px-[1vw] py-[0.8vh] text-[1vw] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <div className="whitespace-nowrap">
          <Button
            variant="secondary"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            작성
          </Button>
        </div>
      </div>

      {/* 정렬 */}
      <OrderSelector order={order} onOrderChange={setOrder} />

      {/* 댓글 목록 — 초기 로딩 스켈레톤 */}
      <div>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <CommentItemSkeleton key={index} />
            ))
          : data?.pages.map((page) =>
              page.data.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  lpId={lpId}
                  order={order}
                />
              ))
            )}
      </div>

      {/* 추가 로딩 스켈레톤 */}
      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, index) => (
          <CommentItemSkeleton key={index} />
        ))}

      <div ref={ref} className="h-4" />
    </div>
  );
};

export default CommentSection;
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoginRequiredModal from '../components/lp/LoginRequiredModal';
import LpDetailSkeleton from '../components/lp/LpDetailSkeleton';
import LpFormModal from '../components/lp/LpFormModal';
import LpDetailContent from '../components/lp/detail/LpDetailContent';
import ConfirmModal from '../components/common/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { useLpCommentSection } from '../hooks/useLpCommentSection';
import { useLpDetailActions } from '../hooks/useLpDetailActions';
import { useLpDetail } from '../hooks/useLpDetail';

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const parsedLpId = Number(lpId);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, userInfo } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!accessToken) setShowLoginModal(true);
  }, [accessToken]);

  const { data, isLoading, isError, error, refetch } = useLpDetail(parsedLpId, !!accessToken);
  const lp = data?.data;

  const {
    comments,
    commentOrder,
    commentInput,
    editingCommentId,
    editingCommentInput,
    openMenuId,
    isCommentLoading,
    isCommentFetchingNext,
    isCreatingComment,
    commentSentinelRef,
    setCommentOrder,
    setCommentInput,
    setEditingCommentInput,
    setOpenMenuId,
    createComment,
    startCommentEdit,
    stopCommentEdit,
    saveCommentEdit,
    deleteComment,
  } = useLpCommentSection(parsedLpId, !!accessToken);

  const {
    isEditingLp,
    isDeletingLp,
    isTogglingLike,
    editLp,
    deleteLp,
    toggleLike,
  } = useLpDetailActions({
    lpId: parsedLpId,
    userId: userInfo?.id,
    onAfterDelete: () => navigate('/'),
    onAfterEdit: () => setShowEditModal(false),
  });

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: location.pathname }, replace: true });
  };

  const handleCancel = () => {
    setShowLoginModal(false);
    navigate('/', { replace: true });
  };

  const isCommentValid = commentInput.trim().length > 0;
  const isAuthor = !!userInfo && !!lp && userInfo.id === lp.authorId;
  const hasLiked = !!userInfo && !!lp?.likes?.some((like) => like.userId === userInfo.id);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-900 text-white">
      {showLoginModal && <LoginRequiredModal onConfirm={handleLoginRedirect} onCancel={handleCancel} />}
      {isLoading && <LpDetailSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-red-400">{(error as Error)?.message ?? '불러오기 실패'}</p>
          <button onClick={() => void refetch()} className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded">
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !isError && lp && (
        <LpDetailContent
          lp={lp}
          userId={userInfo?.id}
          hasLiked={hasLiked}
          isAuthor={isAuthor}
          isTogglingLike={isTogglingLike}
          commentOrder={commentOrder}
          isCommentValid={isCommentValid}
          commentInput={commentInput}
          isCreatingComment={isCreatingComment}
          isCommentLoading={isCommentLoading}
          comments={comments}
          editingCommentId={editingCommentId}
          openMenuId={openMenuId}
          editingCommentInput={editingCommentInput}
          isCommentFetchingNext={isCommentFetchingNext}
          commentSentinelRef={commentSentinelRef}
          setCommentOrder={setCommentOrder}
          setCommentInput={setCommentInput}
          setOpenMenuId={setOpenMenuId}
          setEditingCommentInput={setEditingCommentInput}
          onBack={() => navigate(-1)}
          onToggleLike={() => toggleLike(hasLiked)}
          onEditLp={() => setShowEditModal(true)}
          onDeleteLp={() => setShowDeleteConfirm(true)}
          onCreateComment={createComment}
          onStartCommentEdit={startCommentEdit}
          onDeleteComment={deleteComment}
          onCancelCommentEdit={stopCommentEdit}
          onSaveCommentEdit={saveCommentEdit}
        />
      )}

      {lp && (
        <LpFormModal
          isOpen={showEditModal}
          title="LP 수정"
          submitLabel="수정 저장"
          isSubmitting={isEditingLp}
          initialValues={{
            title: lp.title,
            content: lp.content,
            thumbnail: lp.thumbnail,
            tags: lp.tags?.map((tag) => tag.name) ?? [],
          }}
          onClose={() => setShowEditModal(false)}
          onSubmit={editLp}
        />
      )}

      <ConfirmModal
        open={showDeleteConfirm}
        title="LP를 삭제하시겠습니까?"
        description="삭제 후에는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        loading={isDeletingLp}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteLp();
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
};

export default LpDetailPage;

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useLpDetail from '../../hooks/lp/useLpDetail';
import { useAuth } from '../../hooks/auth/useAuth';
import { useDeleteLpMutation } from '../../hooks/lp/useDeleteLpMutation';
import { useLpEdit } from './hooks/useLpEdit';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import Error from '../../components/error/Error';
import CommentSection from './components/comments/CommentSection';
import Modal from '../../components/modal/Modal';
import TagInput from '../../components/tagInput/TagInput';
import LpHeader from './components/LpHeader';
import LpActionButtons from './components/LpActionButtons';
import LpContent from './components/LpContent';
import LpLikeSection from './components/LpLikeSection';
import LpImageUpload from '../../components/lpImageUpload/LpImageUpload';

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { user } = useAuth();
  const numericLpId = Number(lpId);

  const { data: lp, isLoading, isError, error } = useLpDetail(numericLpId);
  const { mutate: deleteLp } = useDeleteLpMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    isEditing,
    isUpdating,
    previewThumbnail,
    tags,
    register,
    handleSubmit,
    handleFileChange,
    handleAddTag,
    handleRemoveTag,
    handleEdit,
    handleCancel,
    onSubmit,
  } = useLpEdit(lp, numericLpId);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Error message={error.message} />;
  if (!lp) return <Error message="LP 정보를 찾을 수 없습니다." />;

  const isAuthor = user?.id === lp.authorId;

  return (
    <>
      <div className="min-h-full max-w-[60vw] mx-auto py-[3vh] px-[3vw] relative">
        <div className="bg-[#2c2c2c] rounded-lg p-[3vw] text-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <LpHeader
              author={{
                avatar: lp.author?.avatar ?? null,
                name: lp.author?.name ?? 'Unknown',
              }}
              title={lp.title}
              createdAt={lp.createdAt}
              isEditing={isEditing}
              register={register('title', { required: true })}
              actionButtons={
                <LpActionButtons
                  isAuthor={isAuthor}
                  isEditing={isEditing}
                  onEdit={handleEdit}
                  onDelete={() => setIsDeleteModalOpen(true)}
                  onSave={handleSubmit(onSubmit)}
                  onCancel={handleCancel}
                  isSaving={isUpdating}
                />
              }
            />

            <LpImageUpload
              thumbnailUrl={previewThumbnail}
              isEditing={isEditing}
              onFileChange={handleFileChange}
            />

            <LpContent
              content={lp.content}
              isEditing={isEditing}
              register={register('content', { required: true })}
            />

            <div className="mb-[5vh] max-w-md mx-auto">
              {isEditing ? (
                <TagInput
                  tags={tags}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  placeholder="태그를 입력하세요"
                  label="LP 태그"
                />
              ) : (
                <div className="flex justify-center gap-[0.8vw] flex-wrap">
                  {lp.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-gray-600 text-gray-300 px-[1.5vw] py-[0.5vh] rounded-full text-[0.9vw]"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <LpLikeSection
              likeCount={lp.likes.length}
              isLiked={false}
              onLikeToggle={() => {}}
            />
          </form>

          <CommentSection lpId={numericLpId} />
        </div>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteLp(numericLpId);
          setIsDeleteModalOpen(false);
        }}
        content="이 LP를 정말로 삭제하시겠습니까?"
      />
    </>
  );
};

export default LpDetailPage;

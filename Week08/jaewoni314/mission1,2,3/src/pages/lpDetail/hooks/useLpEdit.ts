import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImage } from '../../../apis/upload';
import { useUpdateLpMutation } from '../../../hooks/lp/useUpdateLpMutation';
import { useFilePreview } from '../../../hooks/useFilePreview';
import { useTagsManager } from '../../../hooks/useTagsManager';
import type { Lp } from '../../../types/lp';

interface FormValues {
  title: string;
  content: string;
}

export const useLpEdit = (lp: Lp | undefined, lpId: number) => {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { mutate: updateLp, isPending: isUpdating } = useUpdateLpMutation();

  const {
    previewUrl: previewThumbnail,
    file: thumbnailFile,
    updateFile: setThumbnailFile,
    resetPreview,
  } = useFilePreview({
    initialUrl: lp?.thumbnail,
    useFileReader: true,
  });

  const { tags, handleAddTag, handleRemoveTag, resetTags } = useTagsManager();

  useEffect(() => {
    if (lp) {
      const tagNames = lp.tags?.map((tag) => tag.name) || [];
      reset({
        title: lp.title,
        content: lp.content,
      });
      resetTags(tagNames);
      resetPreview();
    }
  }, [lp, reset, resetPreview, resetTags]);

  const handleFileChange = (file: File) => {
    setThumbnailFile(file);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (lp) {
      reset({
        title: lp.title,
        content: lp.content,
      });
      resetTags(lp.tags?.map((tag) => tag.name) || []);
      resetPreview();
    }
  };

  const onSubmit = async (data: FormValues) => {
    let thumbnailUrl = lp?.thumbnail;

    if (thumbnailFile) {
      try {
        thumbnailUrl = await uploadImage(thumbnailFile);
      } catch {
        alert('이미지 업로드에 실패했습니다.');
        return;
      }
    }

    updateLp(
      {
        lpId,
        lpData: { ...data, tags, thumbnail: thumbnailUrl },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          resetPreview();
        },
      }
    );
  };

  return {
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
  };
};

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImage } from '../../../apis/upload';
import { useUpdateLpMutation } from '../../../hooks/lp/useUpdateLpMutation';
import type { Lp } from '../../../types/lp';

interface FormValues {
  title: string;
  content: string;
}

export const useLpEdit = (lp: Lp | undefined, lpId: number) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { mutate: updateLp, isPending: isUpdating } = useUpdateLpMutation();

  // LP 데이터 초기화
  useEffect(() => {
    if (lp) {
      const tagNames = lp.tags?.map((tag) => tag.name) || [];
      reset({
        title: lp.title,
        content: lp.content,
      });
      setTags(tagNames);
      setPreviewThumbnail(lp.thumbnail);
    }
  }, [lp, reset]);

  // 파일 미리보기
  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewThumbnail(reader.result as string);
      };
      reader.readAsDataURL(thumbnailFile);
    }
  }, [thumbnailFile]);

  const handleFileChange = (file: File) => {
    setThumbnailFile(file);
  };

  const handleAddTag = (tag: string) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
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
      setTags(lp.tags?.map((tag) => tag.name) || []);
      setPreviewThumbnail(lp.thumbnail);
      setThumbnailFile(null);
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
          setThumbnailFile(null);
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

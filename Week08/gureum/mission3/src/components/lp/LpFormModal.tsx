import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '../../apis/upload';
import LpThumbnailPicker from './LpThumbnailPicker';
import TagInputField from './TagInputField';

interface LpFormValues {
  title: string;
  content: string;
  thumbnail: string | null;
  tags: string[];
  published: boolean;
}

interface LpFormModalProps {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  initialValues?: Partial<LpFormValues>;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: LpFormValues) => void;
}

const LpFormModal = ({
  isOpen,
  title,
  submitLabel,
  initialValues,
  isSubmitting,
  onClose,
  onSubmit,
}: LpFormModalProps) => {
  const [lpTitle, setLpTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [thumbnail, setThumbnail] = useState<string | null>(initialValues?.thumbnail ?? null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);

  useEffect(() => {
    if (!isOpen) return;
    setLpTitle(initialValues?.title ?? '');
    setContent(initialValues?.content ?? '');
    setThumbnail(initialValues?.thumbnail ?? null);
    setTagInput('');
    setTags(initialValues?.tags ?? []);
  }, [initialValues, isOpen]);

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (url) => setThumbnail(url),
  });

  if (!isOpen) return null;

  const addTag = () => {
    const normalized = tagInput.trim();
    if (!normalized) return;
    if (tags.includes(normalized)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, normalized]);
    setTagInput('');
  };

  const removeTag = (target: string) => {
    setTags((prev) => prev.filter((tag) => tag !== target));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpTitle.trim() || !content.trim()) return;

    onSubmit({
      title: lpTitle.trim(),
      content: content.trim(),
      thumbnail,
      tags,
      published: true,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-2xl mx-4 bg-gray-900 border border-gray-700 rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <LpThumbnailPicker
            thumbnail={thumbnail}
            isUploading={uploadMutation.isPending}
            onFileChange={(file) => uploadMutation.mutate(file)}
          />

          <input
            value={lpTitle}
            onChange={(e) => setLpTitle(e.target.value)}
            placeholder="LP 제목"
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="LP 본문"
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white resize-none"
          />

          <TagInputField
            tagInput={tagInput}
            tags={tags}
            setTagInput={setTagInput}
            addTag={addTag}
            removeTag={removeTag}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800">
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadMutation.isPending}
              className="px-5 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? '처리 중...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LpFormModal;

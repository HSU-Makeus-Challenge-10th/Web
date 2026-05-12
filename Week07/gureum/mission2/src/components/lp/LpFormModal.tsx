import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '../../apis/upload';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
    e.target.value = '';
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
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-72 h-56 group"
            >
              {thumbnail ? (
                <>
                  {/* 뒤쪽 LP 판 */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-gray-600 bg-black animate-[spin_8s_linear_infinite]">
                    <div className="absolute inset-2 rounded-full bg-[repeating-radial-gradient(circle,_#0f172a_0_2px,_#111827_2px_4px)]" />
                    <div className="absolute inset-[28%] rounded-full bg-gray-200" />
                    <div className="absolute inset-[44%] rounded-full bg-gray-900 border border-gray-500" />
                  </div>

                  {/* 앞쪽 표지 이미지 */}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-45 h-45 rounded-md overflow-hidden border border-gray-600 shadow-2xl bg-gray-800">
                    <img src={thumbnail} alt="LP thumbnail" className="w-full h-full object-cover" />
                  </div>
                </>
              ) : (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-gray-600 bg-black animate-[spin_8s_linear_infinite]">
                  <div className="absolute inset-2 rounded-full bg-[repeating-radial-gradient(circle,_#0f172a_0_2px,_#111827_2px_4px)]" />
                  <div className="absolute inset-[28%] rounded-full bg-gray-200" />
                  <div className="absolute inset-[44%] rounded-full bg-gray-900 border border-gray-500" />
                </div>
              )}

              <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-xs text-white opacity-0 group-hover:opacity-100 bg-black/60 px-2 py-1 rounded">이미지 선택</span>
              </div>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadMutation.isPending && <p className="text-xs text-center text-gray-400">이미지 업로드 중...</p>}

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

          <div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;

                  // Enter 기본 동작(폼 submit) 차단
                  e.preventDefault();

                  // 한글 IME 조합 중 Enter는 태그 추가를 건너뛴다.
                  // keyCode 229는 조합 입력 이벤트 호환 처리
                  if (e.nativeEvent.isComposing || (e.nativeEvent as KeyboardEvent).keyCode === 229) return;

                  addTag();
                }}
                placeholder="태그 입력"
                className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white"
              />
              <button type="button" onClick={addTag} className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white">
                추가
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-700 text-sm text-gray-200">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-gray-300 hover:text-white">x</button>
                </span>
              ))}
            </div>
          </div>

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

import { useState, useRef } from "react";
import { X, ImagePlus, Plus, Trash2, Loader2 } from "lucide-react";
import { useCreateLp } from "../hooks/useCreateLp";
import { uploadImage } from "../apis/lp";

interface CreateLpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLpModal = ({ isOpen, onClose }: CreateLpModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createLpMutation = useCreateLp();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용은 필수입니다.");
      return;
    }

    if (tags.length === 0) {
      alert("최소 한 개 이상의 태그를 입력해야 합니다.");
      return;
    }

    let imageUrl = "";

    try {
      if (thumbnail) {
        setIsUploading(true);
        imageUrl = await uploadImage(thumbnail);
      }
    } catch (error: any) {
      setIsUploading(false);
      const serverMessage = error.response?.data?.message;
      alert(`이미지 업로드에 실패했습니다: ${serverMessage || error.message}`);
      return;
    } finally {
      setIsUploading(false);
    }

    createLpMutation.mutate(
      {
        title: title.trim(),
        content: content.trim(),
        thumbnail: imageUrl,
        tags,
        published: true,
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
        onError: (error: any) => {
          const serverMessage = error.response?.data?.message;
          alert(`LP 작성에 실패했습니다: ${serverMessage || error.message}`);
        },
      }
    );
  };

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* 모달 */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            새 LP 작성
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 바디 (스크롤 가능) */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* LP 사진 업로드 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <ImagePlus className="w-4 h-4" />
              <span>LP 사진</span>
            </label>

            {thumbnailPreview ? (
              <div className="relative group">
                <img
                  src={thumbnailPreview}
                  alt="LP 미리보기"
                  className="w-full h-48 object-cover rounded-2xl border border-gray-200 dark:border-gray-700"
                />
                <button
                  onClick={removeThumbnail}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all group cursor-pointer"
              >
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                  <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-purple-500 transition-colors">
                    클릭하여 사진 업로드
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    JPG, PNG, GIF (최대 10MB)
                  </p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 제목 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span>제목</span>
              <span className="text-xs text-red-500 font-normal">*필수</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP 제목을 입력하세요"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span>내용</span>
              <span className="text-xs text-red-500 font-normal">*필수</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="LP에 담을 이야기를 적어주세요"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span>태그</span>
              <span className="text-xs text-gray-400 font-normal">(Enter로 추가)</span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="태그를 입력 후 Enter"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 푸터 버튼 */}
        <div className="p-6 pt-0">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={createLpMutation.isPending || isUploading}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={createLpMutation.isPending || isUploading || !title.trim() || !content.trim()}
              className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {createLpMutation.isPending || isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isUploading ? "이미지 업로드 중..." : "작성 중..."}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add LP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLpModal;

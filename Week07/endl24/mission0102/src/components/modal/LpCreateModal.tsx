import { useState, useRef, useEffect } from "react";
import { CommonModal } from "./CommonModal";
import usePostLp from "../../hooks/mutations/usePostLp";
import { axiosInstance } from "../../apis/axios";
import { useUpdateLp } from "../../hooks/mutations/useUpdateLp";

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  lpId?: number;
  initialData?: {
    title: string;
    content: string;
    thumbnail: string;
    tags?: string[];
  };
}

export const LpCreateModal = ({
  isOpen,
  onClose,
  isEdit,
  lpId,
  initialData,
}: LpCreateModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { mutate: createLp } = usePostLp();
  const { mutate: updateLpMutate } = useUpdateLp(lpId || 0);
  
  // 태그 상태
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // 이미지 상태
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setImagePreview(initialData.thumbnail);
        setTags(initialData.tags || []);
      } else {
        // 새로 작성 모드일 때 초기화
        setTitle("");
        setContent("");
        setTags([]);
        setImageFile(null);
        setImagePreview(null);
        setTagInput("");
      }
    }
  }, [isOpen, isEdit, initialData]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
      e.preventDefault(); 
      const newTag = tagInput.trim();
      if (newTag !== "" && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput(""); 
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      setImageFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    handleRemoveImage();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return alert("제목과 내용을 모두 입력해주세요");
    }
    if (!imageFile && !imagePreview) {
      return alert("사진을 업로드해주세요!");
    }
    
    try {
      let finalImageUrl = initialData?.thumbnail || "";

      if (imageFile) {
        const imgFormData = new FormData();
        imgFormData.append("file", imageFile);

        const imgResponse = await axiosInstance.post(
          "/v1/uploads",
          imgFormData,
        );
        finalImageUrl = imgResponse.data.data?.imageUrl;
      }

      const requestData = {
        title: title,
        content: content,
        thumbnail: finalImageUrl,
        tags: tags, 
        published: true,
      };

      if (isEdit) {
        updateLpMutate(requestData, {
          onSuccess: () => {
            handleClose();
            if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);
          },
        });
      } else {
        createLp(requestData, {
          onSuccess: () => {
            handleClose();
            if (imagePreview) URL.revokeObjectURL(imagePreview);
          },
        });
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <CommonModal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "LP 수정하기" : "새 LP 작성하기"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP의 제목을 입력하세요"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사진 업로드
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-indigo-500 transition-colors cursor-pointer"
              >
                <span className="text-2xl mb-1">+</span>
                <span className="text-sm">클릭해서 사진을 업로드하세요</span>
              </button>
            ) : (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              태그 (엔터로 추가)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="태그 입력 후 엔터를 누르세요"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div 
                    key={tag} 
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium border border-indigo-100"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button" // form 전송을 막기 위해 반드시 type="button" 명시
                      onClick={() => handleRemoveTag(tag)}
                      className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              {isEdit ? "저장하기" : "작성하기"}
            </button>
          </div>
        </form>
      </div>
    </CommonModal>
  );
};
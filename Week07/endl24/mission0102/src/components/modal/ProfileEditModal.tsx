import { useState, useRef, useEffect } from "react";
import { CommonModal } from "./CommonModal";
import { axiosInstance } from "../../apis/axios";
import { useUpdateProfile } from "../../hooks/mutations/useUpdateProfile";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    bio: string | null;
    avatar: string | null;
  };
}

export const ProfileEditModal = ({ isOpen, onClose, initialData }: ProfileEditModalProps) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name || "");
      setBio(initialData.bio || "");
      setImagePreview(initialData.avatar || null);
    }
  }, [isOpen, initialData]);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    setImageFile(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert("이름(닉네임)은 필수입니다.");
    }

    try {
      let finalAvatarUrl = imagePreview;

      // 사용자가 사진을 등록한 경우에만 업로드 API 호출
      if (imageFile) {
        const imgFormData = new FormData();
        imgFormData.append("file", imageFile);
        const imgResponse = await axiosInstance.post("/v1/uploads", imgFormData);
        finalAvatarUrl = imgResponse.data.data?.imageUrl;
      }

      const requestData = {
        name,
        bio: bio.trim() === "" ? null : bio, // 빈 문자열이면 null로 처리
        avatar: finalAvatarUrl, 
      };

      updateProfile(requestData, {
        onSuccess: () => {
          handleClose();
          if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);
        },
      });
    } catch (error) {
      console.error("업로드/수정 실패:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <CommonModal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">프로필 설정</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col items-center gap-3">
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
            
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {imagePreview ? (
                <img src={imagePreview} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                  {name?.[0] || "U"}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                사진 변경
              </button>
              {imagePreview && (
                <button type="button" onClick={handleRemoveImage} className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                  기본 이미지로
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 (닉네임) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              자기소개 (선택)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기 소개를 작성하세요"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              취소
            </button>
            <button type="submit" disabled={isPending} className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
              {isPending ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </CommonModal>
  );
};
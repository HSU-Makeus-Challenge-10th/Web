// src/components/LPCreationModal.tsx

import React, { useRef, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp } from "../apis/lp";

// ----------------------------------------------------------------------
// 1. 타입 정의 및 쿼리 키
// ----------------------------------------------------------------------

interface CreateLpDto {
  title: string;
  content: string;
  thumbnail: string; // URL 또는 Base64 문자열 (현재 임시 방편)
  tags: string[];
  published: boolean;
}

interface LpItem extends CreateLpDto {
  id: number | string;
}
interface ResponseLpListDto {
  data: LpItem[];
}

const LP_QUERY_KEY = ["myLPs"];

interface LPCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LPCreationModal: React.FC<LPCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 폼 데이터 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // 파일 객체는 유지
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); // Base64 미리보기 문자열

  // ... (기존 핸들러 함수들: handleThumbnailClick, handleFileChange, handleAddTag, handleRemoveTag, handleTagInputKeyPress, resetForm 유지) ...

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = useCallback(() => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  // ----------------------------------------------------------------------
  // 2. useMutation (API 호출 및 낙관적 업데이트)
  // ----------------------------------------------------------------------

  const mutation = useMutation({
    mutationFn: (lpData: CreateLpDto) => createLp(lpData),

    // 🚀 onMutate: 낙관적 업데이트 수행 및 롤백 데이터 저장
    onMutate: async (newLPData) => {
      await queryClient.cancelQueries({ queryKey: LP_QUERY_KEY });
      const previousLPList =
        queryClient.getQueryData<ResponseLpListDto>(LP_QUERY_KEY);

      queryClient.setQueryData<ResponseLpListDto>(LP_QUERY_KEY, (oldData) => {
        if (!oldData) return { data: [] };

        const tempLP: LpItem = {
          ...newLPData,
          id: "temp-" + Date.now(),
        };

        return {
          ...oldData,
          data: [tempLP, ...oldData.data],
        };
      });

      return { previousLPList };
    },

    // 🛑 onError: 요청 실패 시 이전 상태로 롤백
    onError: (error, newLPData, context) => {
      console.error("LP 생성 실패: 롤백 실행", error);

      if (context?.previousLPList) {
        queryClient.setQueryData(LP_QUERY_KEY, context.previousLPList);
        alert("LP 생성에 실패했습니다. (롤백됨)");
      } else {
        queryClient.invalidateQueries({ queryKey: LP_QUERY_KEY });
        alert("LP 생성에 실패했습니다. 목록을 새로고침합니다.");
      }
    },

    // ✅ onSettled: 최종 상태 동기화 및 정리 작업
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LP_QUERY_KEY });
      onClose();
      resetForm();
    },
  });

  // ----------------------------------------------------------------------
  // 3. handleSubmit 수정: 동기 방식으로 Base64 전달
  // ----------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mutation.isPending) return;

    // thumbnailFile 대신 thumbnailPreview의 존재 여부로 검증
    if (!title.trim() || !content.trim() || !thumbnailPreview) {
      alert("LP 이름, 내용, 사진은 필수 입력 항목입니다.");
      return;
    }

    // Base64 문자열을 그대로 API에 전달 (임시 방편)
    const payload: CreateLpDto = {
      title: title.trim(),
      content: content.trim(),
      thumbnail: thumbnailPreview, // ⚠️ Base64 문자열을 사용합니다.
      tags: tags,
      published: true,
    };

    mutation.mutate(payload);
  };

  // ----------------------------------------------------------------------
  // 4. 렌더링
  // ----------------------------------------------------------------------

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-sm w-full border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="모달 닫기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 1. LP 이미지 입력 영역 및 미리보기 */}
        <div className="flex justify-center my-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            disabled={mutation.isPending}
          />
          <button
            type="button"
            onClick={handleThumbnailClick}
            className="relative w-[150px] h-[150px] rounded-full overflow-hidden border-2 border-dashed border-gray-600 hover:border-pink-500 transition-colors flex items-center justify-center cursor-pointer"
            disabled={mutation.isPending}
          >
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="LP Thumbnail Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              // 이미지 없을 때 기본 LP 아이콘 (SVG)
              <svg
                width="150"
                height="150"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="#374151"
                  stroke="#4B5563"
                  strokeWidth="5"
                />
                <circle cx="100" cy="100" r="30" fill="#EAB308" />
                <circle cx="100" cy="100" r="5" fill="#1F2937" />
                <path
                  d="M 100 5 L 100 100 L 100 195"
                  stroke="black"
                  strokeWidth="1"
                  opacity="0.1"
                />
              </svg>
            )}

            {/* 로딩 인디케이터 */}
            {mutation.isPending && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    className="opacity-75"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* 폼 입력 필드 */}
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="LP Name (title)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-pink-500 focus:outline-none"
            disabled={mutation.isPending}
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-pink-500 focus:outline-none"
            disabled={mutation.isPending}
          />

          {/* LP Tag 입력 및 추가 버튼 */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              className="flex-1 bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-pink-500 focus:outline-none"
              disabled={mutation.isPending}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded font-semibold transition-colors shrink-0"
              disabled={!tagInput.trim() || mutation.isPending}
            >
              Add
            </button>
          </div>

          {/* 2. 현재 태그 목록 표시 */}
          <div className="flex flex-wrap gap-2 pt-2 min-h-[30px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-gray-600 text-white text-sm px-3 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-gray-300 hover:text-white transition-colors"
                  aria-label={`태그 ${tag} 삭제`}
                  disabled={mutation.isPending}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {/* 3. 최종 Add LP 버튼 */}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded font-bold transition-colors mt-6 disabled:bg-pink-800"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding LP..." : "Add LP"}
          </button>
        </form>
      </div>
    </div>
  );
};

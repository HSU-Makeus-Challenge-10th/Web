import { useState } from "react";
import { usePostComment } from "../hooks/mutations/usePostComment"; 

export const CommentInput = ({ lpId }: { lpId: number }) => {
  const [content, setContent] = useState("");
  const { mutate: createComment, isPending } = usePostComment(lpId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert("댓글을 입력해주세요.");

    createComment(content, {
      onSuccess: () => {
        setContent(""); 
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 남겨주세요."
        className="w-full bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400 min-h-20"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
        >
          {isPending ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
    </form>
  );
};
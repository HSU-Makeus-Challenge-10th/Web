interface CommentComposerProps {
  value: string;
  isValid: boolean;
  isPending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const CommentComposer = ({ value, isValid, isPending, onChange, onSubmit }: CommentComposerProps) => {
  return (
    <div className="mb-6">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="댓글을 입력해주세요..."
        rows={3}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
      />
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValid || isPending}
          className="px-5 py-2 rounded text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50"
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommentComposer;

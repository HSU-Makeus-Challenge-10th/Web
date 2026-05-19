import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

interface CommentEditInputProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  isUpdating: boolean;
}

const CommentEditInput = ({
  initialContent,
  onSave,
  onCancel,
  isUpdating,
}: CommentEditInputProps) => {
  const [content, setContent] = useState(initialContent);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBlur = () => {
    if (!isUpdating) {
      onCancel();
    }
  };

  const handleSave = () => {
    if (!content.trim() || content === initialContent) {
      onCancel();
      return;
    }
    onSave(content);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="mt-[0.5vh] flex items-center gap-[0.5vw]">
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        className="flex-1 bg-gray-800 border border-gray-700 rounded px-[0.8vw] py-[0.5vh] text-[1vw] text-white focus:outline-none focus:border-white"
        disabled={isUpdating}
      />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleSave}
        className="p-[0.5vh] text-green-400 hover:text-green-300 transition-colors"
        disabled={isUpdating}
      >
        <Check size={18} />
      </button>
    </div>
  );
};

export default CommentEditInput;

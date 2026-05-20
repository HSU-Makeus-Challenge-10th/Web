import type React from 'react';

interface TagInputFieldProps {
  tagInput: string;
  tags: string[];
  setTagInput: (value: string) => void;
  addTag: () => void;
  removeTag: (target: string) => void;
}

const TagInputField = ({ tagInput, tags, setTagInput, addTag, removeTag }: TagInputFieldProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    if (e.nativeEvent.isComposing || (e.nativeEvent as KeyboardEvent).keyCode === 229) return;
    addTag();
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
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
  );
};

export default TagInputField;

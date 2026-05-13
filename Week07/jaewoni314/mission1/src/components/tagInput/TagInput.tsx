import React from 'react';
import { X } from 'lucide-react';
import Input from '../input/Input';
import Button from '../button/Button';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
  label?: string;
}

const TagInput = ({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder = '태그를 입력하세요',
  label = 'Tag',
}: TagInputProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleAddClick = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAddTag(trimmed);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddClick();
    }
  };

  return (
    <div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            label={label}
            placeholder={placeholder}
            autoComplete="off"
          />
        </div>
        <Button
          type="button"
          onClick={handleAddClick}
          className="whitespace-nowrap px-[1vw] py-[0.8vh] min-h-[42px]"
        >
          추가
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;

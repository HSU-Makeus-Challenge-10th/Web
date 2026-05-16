import { useState } from 'react';
import Button from '../../../../components/button/Button';
import Input from '../../../../components/input/Input';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isCreating: boolean;
}

const CommentForm = ({ onSubmit, isCreating }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-[1vw] mb-[3vh]">
      <Input
        type="text"
        placeholder="댓글을 입력해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div className="whitespace-nowrap">
        <Button
          variant="secondary"
          size="md"
          onClick={handleSubmit}
          disabled={isCreating || !content.trim()}
        >
          {isCreating ? '작성 중...' : '작성'}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;

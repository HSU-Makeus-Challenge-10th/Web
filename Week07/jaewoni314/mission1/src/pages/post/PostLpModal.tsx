import { useState } from 'react';
import { useCreateLp } from '../../hooks/lp/useCreateLp';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import Modal from '../../components/modal/Modal';
import { uploadImage } from '../../apis/upload';
import TagInput from '../../components/tagInput/TagInput';
import LpImageUpload from '../../components/lpImageUpload/LpImageUpload';

interface PostLpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostLpModal = ({ isOpen, onClose }: PostLpModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const createLpMutation = useCreateLp();

  const isFormValid =
    title.trim() && content.trim() && tags.length > 0 && selectedFile;

  const handleFileChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setSelectedFile(file);
  };

  const handleAddTag = (tag: string) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert('모든 필수 항목을 입력하고 이미지를 선택하세요.');
      return;
    }

    if (!selectedFile) {
      console.error('이미지가 선택되지 않았습니다.');
      return;
    }

    try {
      const uploadedUrl = await uploadImage(selectedFile);

      createLpMutation.mutate(
        {
          title,
          content,
          thumbnail: uploadedUrl,
          tags,
          published: true,
        },
        {
          onSuccess: () => {
            onClose();
            setTitle('');
            setContent('');
            setTags([]);
            setPreview(null);
            setSelectedFile(null);
          },
          onError: (error) => {
            alert('LP를 불러오는데 실패했습니다.: ' + error.message);
          },
        }
      );
    } catch (err) {
      alert('이미지 업로드에 실패했습니다: ' + err);
      console.error('업로드 실패:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <LpImageUpload
          thumbnailUrl={preview}
          onFileChange={handleFileChange}
          size="small"
        />
        <Input
          label="LP Name"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="LP 이름을 입력하세요"
          required
        />
        <Input
          label="LP 내용"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setContent(e.target.value)
          }
          placeholder="LP 내용을 입력하세요"
          required
        />

        <TagInput
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          label="LP 태그"
          placeholder="태그를 입력하세요"
        />

        <Button
          type="submit"
          fullWidth
          disabled={createLpMutation.isPending || !isFormValid}
        >
          {createLpMutation.isPending ? 'LP 추가 중...' : 'LP 추가'}
        </Button>
      </form>
    </Modal>
  );
};

export default PostLpModal;

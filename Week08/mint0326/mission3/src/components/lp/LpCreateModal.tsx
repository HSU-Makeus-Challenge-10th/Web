import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import Modal from '../common/Modal';

interface LpCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const createLpMutation = useMutation({
        mutationFn: async () => {
            let thumbnailUrl = '';

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadRes = await api.post('/v1/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                thumbnailUrl = uploadRes.data?.data?.imageUrl || '';
            }

            const payload = {
                title,
                content,
                thumbnail: thumbnailUrl,
                tags,
                published: true,
            };

            await api.post('/v1/lps', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lpList'] });
            alert('LP가 성공적으로 생성되었습니다!');
            onClose();
            setTitle('');
            setContent('');
            setTags([]);
            setImageFile(null);
            setImagePreview(null);
        },
        onError: (e) => {
            console.error('LP 생성 실패:', e);
            alert('LP 생성에 실패했습니다.');
        }
    });

    const handleAddTag = () => {
        if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const isSubmitDisabled = createLpMutation.isPending || !title || !content || tags.length === 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center mt-4 space-y-6">
                {/* 이미지 업로드 영역 */}
                <div
                    className="w-40 h-40 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                                <Upload className="text-white w-8 h-8" />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-xs">사진 업로드</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="w-full space-y-4">
                    <input
                        type="text"
                        placeholder="LP Name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#111111] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-[#ff007f]"
                    />
                    <input
                        type="text"
                        placeholder="LP Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-[#111111] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-[#ff007f]"
                    />

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="LP Tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            className="flex-1 bg-[#111111] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-[#ff007f]"
                        />
                        <button
                            onClick={handleAddTag}
                            className="bg-[#99aab5] hover:bg-[#7289da] text-white px-4 rounded-md font-semibold transition-colors cursor-pointer"
                        >
                            Add
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map(tag => (
                                <span key={tag} className="flex items-center bg-[#333333] px-3 py-1 rounded-full text-sm">
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => createLpMutation.mutate()}
                    disabled={isSubmitDisabled}
                    className={`w-full py-3 rounded-md font-bold transition-colors cursor-pointer ${
                        isSubmitDisabled
                            ? 'bg-[#99aab5] text-gray-200 cursor-not-allowed'
                            : 'bg-[#99aab5] hover:bg-[#7289da] text-white'
                    }`}
                >
                    {createLpMutation.isPending ? 'Adding...' : 'Add LP'}
                </button>
            </div>
        </Modal>
    );
};

export default LpCreateModal;

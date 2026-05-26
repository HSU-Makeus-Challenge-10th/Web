import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

interface UseLpEditProps {
    lp: any;
    isOpen: boolean;
    onClose: () => void;
}

export const useLpEdit = ({ lp, isOpen, onClose }: UseLpEditProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const queryClient = useQueryClient();

    useEffect(() => {
        if (lp && isOpen) {
            setTitle(lp.title || '');
            setContent(lp.content || '');
            setTags(lp.tags?.map((t: any) => t.name) || []);
            setImagePreview(lp.thumbnail || null);
        }
    }, [lp, isOpen]);

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

    const updateLpMutation = useMutation({
        mutationFn: async () => {
            let thumbnailUrl = lp.thumbnail;
            
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

            await api.patch(`/v1/lps/${lp.id}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lpDetail', lp.id] });
            queryClient.invalidateQueries({ queryKey: ['lpList'] });
            alert('LP가 성공적으로 수정되었습니다!');
            onClose();
        },
        onError: (e) => {
            console.error('LP 수정 실패:', e);
            alert('LP 수정에 실패했습니다.');
        }
    });

    const isSaveDisabled = updateLpMutation.isPending || !title || !content || tags.length === 0;

    return {
        state: {
            title,
            content,
            tagInput,
            tags,
            imagePreview,
            isPending: updateLpMutation.isPending,
            isSaveDisabled,
        },
        refs: {
            fileInputRef,
        },
        actions: {
            setTitle,
            setContent,
            setTagInput,
            handleAddTag,
            handleRemoveTag,
            handleFileChange,
            handleSave: () => updateLpMutation.mutate(),
        }
    };
};

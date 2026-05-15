import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

export const useProfile = () => {
    const { logout } = useAuth();
    const queryClient = useQueryClient();
    
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: userProfile, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const res = await api.get('/v1/users/me');
            return res.data.data;
        }
    });

    useEffect(() => {
        if (!isEditing && userProfile) {
            setName(userProfile.name || '');
            setBio(userProfile.bio || '');
            setImagePreview(userProfile.avatar || null);
        }
    }, [userProfile, isEditing]);

    const updateProfileMutation = useMutation({
        mutationFn: async () => {
            let avatarUrl = userProfile?.avatar || '';
            
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadRes = await api.post('/v1/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                avatarUrl = uploadRes.data?.data?.imageUrl || '';
            }

            const payload = {
                name,
                bio: bio || '',
                avatar: avatarUrl || '',
            };
            
            await api.patch('/v1/users', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setIsEditing(false);
            setImageFile(null);
            alert('프로필이 성공적으로 수정되었습니다.');
        },
        onError: (e) => {
            console.error(e);
            alert('프로필 수정에 실패했습니다.');
        }
    });

    const handleEditStart = () => {
        setName(userProfile?.name || '');
        setBio(userProfile?.bio || '');
        setImagePreview(userProfile?.avatar || null);
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setImageFile(null);
        setImagePreview(userProfile?.avatar || null);
        setName(userProfile?.name || '');
        setBio(userProfile?.bio || '');
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

    const handleLogout = async () => {
        try {
            await api.post('/v1/auth/signout');
            logout();
        } catch (error) {
            console.error('Logout error:', error);
            logout();
        }
    };

    return {
        state: {
            userProfile,
            isLoading,
            isEditing,
            name,
            bio,
            imagePreview,
            isPending: updateProfileMutation.isPending,
        },
        refs: {
            fileInputRef,
        },
        actions: {
            setName,
            setBio,
            handleEditStart,
            handleEditCancel,
            handleFileChange,
            handleLogout,
            handleSave: () => updateProfileMutation.mutate(),
        }
    };
};

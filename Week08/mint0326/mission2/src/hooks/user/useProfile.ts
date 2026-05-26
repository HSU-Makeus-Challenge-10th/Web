import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

export const useProfile = () => {
    const { logout, isLoggedIn, updateUser } = useAuth();
    const navigate = useNavigate();
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
        },
        enabled: isLoggedIn, // 로그인 상태일 때만 실행
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
        onMutate: async () => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ['userProfile'] });

            // 이전 상태 스냅샷
            const previousProfile = queryClient.getQueryData(['userProfile']);

            // 낙관적 업데이트: 캐시를 새 이름으로 즉시 갱신
            queryClient.setQueryData(['userProfile'], (old: any) => ({
                ...old,
                name,
                bio,
            }));

            // [미션 요구사항] Nav-Bar(Header) 닉네임 즉시 변경
            updateUser({ name });
            
            return { previousProfile };
        },
        onSuccess: () => {
            setIsEditing(false);
            setImageFile(null);
        },
        onError: (e, __, context) => {
            console.error(e);
            // 에러 발생 시 롤백
            if (context?.previousProfile) {
                queryClient.setQueryData(['userProfile'], context.previousProfile);
                updateUser({ name: context.previousProfile.name });
            }
            alert('프로필 수정에 실패했습니다.');
        },
        onSettled: () => {
            // 최종적으로 서버와 동기화
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post('/v1/auth/signout');
        },
        onSuccess: () => {
            queryClient.clear();
            logout();
        },
        onError: (e) => {
            console.error('Logout error:', e);
            logout();
        }
    });

    const withdrawMutation = useMutation({
        mutationFn: async () => {
            await api.delete('/v1/users');
        },
        onSuccess: () => {
            alert('회원 탈퇴가 완료되었습니다.');
            queryClient.clear();
            logout();
            navigate('/login');
        },
        onError: (e) => {
            console.error('Withdrawal error:', e);
            alert('회원 탈퇴에 실패했습니다.');
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

    return {
        state: {
            userProfile,
            isLoading,
            isEditing,
            name,
            bio,
            imagePreview,
            isPending: updateProfileMutation.isPending,
            isLogoutPending: logoutMutation.isPending,
            isWithdrawPending: withdrawMutation.isPending,
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
            handleLogout: () => logoutMutation.mutate(),
            handleWithdraw: () => withdrawMutation.mutate(),
            handleSave: () => updateProfileMutation.mutate(),
        }
    };
};

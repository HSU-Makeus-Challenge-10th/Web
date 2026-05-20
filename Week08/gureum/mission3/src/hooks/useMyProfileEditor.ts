import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { patchMyInfo } from '../apis/auth';
import { uploadImage } from '../apis/upload';
import type { UserInfo } from '../types/auth';

interface UseMyProfileEditorParams {
  userInfo: UserInfo | null;
  updateUserInfo: (updater: Partial<UserInfo>) => void;
}

export const useMyProfileEditor = ({ userInfo, updateUserInfo }: UseMyProfileEditorParams) => {
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!userInfo) return;
    setName(userInfo.name);
    setBio(userInfo.bio ?? '');
    setAvatar(userInfo.avatar);
  }, [userInfo]);

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (url) => setAvatar(url),
  });

  const updateMutation = useMutation({
    mutationFn: patchMyInfo,
    onMutate: async (nextProfile) => {
      const previousUserInfo = userInfo;

      updateUserInfo({
        name: nextProfile.name,
        bio: nextProfile.bio ?? null,
        avatar: nextProfile.avatar ?? null,
      });

      return { previousUserInfo };
    },
    onError: (_error, _nextProfile, context) => {
      if (context?.previousUserInfo) updateUserInfo(context.previousUserInfo);
    },
    onSuccess: (response) => {
      updateUserInfo(response.data);
      setShowSaveConfirm(false);
      setIsEditingName(false);
      setIsEditingBio(false);
    },
  });

  const profilePayload = useMemo(() => ({
    name: name.trim(),
    bio: bio.trim() ? bio.trim() : null,
    avatar,
  }), [avatar, bio, name]);

  const hasChanges = !!userInfo && (
    profilePayload.name !== userInfo.name
    || profilePayload.bio !== userInfo.bio
    || profilePayload.avatar !== userInfo.avatar
  );

  const isSaveDisabled = !profilePayload.name
    || updateMutation.isPending
    || uploadMutation.isPending
    || !hasChanges;

  return {
    showSaveConfirm,
    isEditingName,
    isEditingBio,
    name,
    bio,
    avatar,
    isUploading: uploadMutation.isPending,
    isSaving: updateMutation.isPending,
    isSaveDisabled,
    setShowSaveConfirm,
    setIsEditingName,
    setIsEditingBio,
    setName,
    setBio,
    uploadAvatar: (file: File) => uploadMutation.mutate(file),
    resetNameEdit: () => {
      setName('');
      setIsEditingName(false);
    },
    resetBioEdit: () => {
      setBio('');
      setIsEditingBio(false);
    },
    saveProfile: () => updateMutation.mutate(profilePayload),
  };
};

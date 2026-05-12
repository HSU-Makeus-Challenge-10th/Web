import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { patchMyInfo } from '../apis/auth';
import { uploadImage } from '../apis/upload';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/common/ConfirmModal';
import EditableField from '../components/mypage/EditableField';
import ProfileImageEditor from '../components/mypage/ProfileImageEditor';

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken, userInfo, fetchUserInfo, updateUserInfo } = useAuth();
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login', { state: { from: '/my' }, replace: true });
    }
  }, [accessToken, navigate]);

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
      await queryClient.cancelQueries({ queryKey: ['myInfo'] });

      const previousUserInfo = userInfo;

      updateUserInfo({
        name: nextProfile.name,
        bio: nextProfile.bio ?? null,
        avatar: nextProfile.avatar ?? null,
      });

      return { previousUserInfo };
    },
    onError: (_error, _nextProfile, context) => {
      if (context?.previousUserInfo) {
        updateUserInfo(context.previousUserInfo);
      }
    },
    onSuccess: async () => {
      await fetchUserInfo();
      setShowSaveConfirm(false);
      setIsEditingName(false);
      setIsEditingBio(false);
    },
  });

  const hasChanges = !!userInfo && (
    name.trim() !== userInfo.name
    || (bio.trim() ? bio.trim() : null) !== userInfo.bio
    || avatar !== userInfo.avatar
  );

  const isSaveDisabled = !name.trim() || updateMutation.isPending || uploadMutation.isPending || !hasChanges;

  const profilePayload = {
    name: name.trim(),
    bio: bio.trim() ? bio.trim() : null,
    avatar,
  };

  const handleStopNameEdit = () => {
    setName('');
    setIsEditingName(false);
  };

  const handleStopBioEdit = () => {
    setBio('');
    setIsEditingBio(false);
  };

  const handleConfirmSave = () => {
    updateMutation.mutate(profilePayload);
  };

  if (!userInfo) {
    return <div className="min-h-[calc(100vh-65px)] flex items-center justify-center text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-65px)] p-6 max-w-3xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">마이 페이지</h1>
          <button
            type="button"
            disabled={isSaveDisabled}
            onClick={() => setShowSaveConfirm(true)}
            className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50"
          >
            설정
          </button>
        </div>

        <div className="space-y-5">
          <ProfileImageEditor
            avatar={avatar}
            isUploading={uploadMutation.isPending}
            onFileChange={(file) => uploadMutation.mutate(file)}
          />

          <div>
            <label className="block text-sm text-gray-300 mb-1">이메일</label>
            <input
              value={userInfo.email}
              readOnly
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-gray-400"
            />
          </div>

          <EditableField
            label="닉네임"
            value={name}
            isEditing={isEditingName}
            onChange={setName}
            onStartEdit={() => setIsEditingName(true)}
            onStopEdit={handleStopNameEdit}
          />

          <EditableField
            label="설명 (Bio, 선택)"
            value={bio}
            placeholder="소개를 입력해주세요"
            isEditing={isEditingBio}
            onChange={setBio}
            onStartEdit={() => setIsEditingBio(true)}
            onStopEdit={handleStopBioEdit}
          />
        </div>
      </div>

      <ConfirmModal
        open={showSaveConfirm}
        title="프로필을 저장하시겠습니까?"
        description="수정한 닉네임/설명/프로필 사진이 반영됩니다."
        confirmText="저장"
        cancelText="취소"
        loading={updateMutation.isPending}
        onCancel={() => setShowSaveConfirm(false)}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
};

export default MyPage;

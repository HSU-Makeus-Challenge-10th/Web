import { useState } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { useUpdateUserMutation } from '../../hooks/auth/useUpdateUserMutation';
import { useFilePreview } from '../../hooks/useFilePreview';
import { uploadImage } from '../../apis/upload';
import Button from '../../components/button/Button';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import AvatarUpload from '../../components/avatarUpload/AvatarUpload';
import ProfileInfo from './components/ProfileInfo';

const MyPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const {
    previewUrl: previewAvatar,
    file: avatarFile,
    updateFile: setAvatarFile,
    resetPreview,
  } = useFilePreview({
    initialUrl: user?.avatar,
    useFileReader: true,
  });

  const handleEditClick = () => {
    if (!user) return;
    setName(user.name);
    setBio(user.bio || '');
    resetPreview();
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    resetPreview();
  };

  const handleAvatarFileChange = (file: File) => {
    setAvatarFile(file);
  };

  const handleSaveClick = async () => {
    let avatarUrl = user?.avatar || undefined;

    if (avatarFile) {
      try {
        avatarUrl = await uploadImage(avatarFile);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
        return;
      }
    }

    updateUser(
      { name, bio, avatar: avatarUrl },
      {
        onSuccess: () => {
          setIsEditing(false);
          resetPreview();
        },
      }
    );
  };

  if (isUserLoading) return <LoadingSpinner />;
  if (!user) return <div>사용자 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">마이페이지</h1>
      <div className="bg-gray-800 p-8 rounded-lg text-white">
        <div className="flex items-center space-x-6 mb-6">
          <AvatarUpload
            previewUrl={previewAvatar}
            onFileChange={handleAvatarFileChange}
            isEditing={isEditing}
            alt={user.name}
          />

          <ProfileInfo
            name={isEditing ? name : user.name}
            email={user.email}
            bio={isEditing ? bio : user.bio}
            isEditing={isEditing}
            onNameChange={setName}
            onBioChange={setBio}
          />
        </div>

        <div className="pt-4 flex gap-3">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                onClick={handleCancelClick}
                disabled={isUpdating}
              >
                취소
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveClick}
                disabled={isUpdating}
              >
                {isUpdating ? '저장 중...' : '저장'}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleEditClick}>
              프로필 수정
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/common/ConfirmModal';
import EditableField from '../components/mypage/EditableField';
import ProfileImageEditor from '../components/mypage/ProfileImageEditor';
import { useMyProfileEditor } from '../hooks/useMyProfileEditor';

const MyPage = () => {
  const navigate = useNavigate();
  const { accessToken, userInfo, updateUserInfo } = useAuth();
  const {
    showSaveConfirm,
    isEditingName,
    isEditingBio,
    name,
    bio,
    avatar,
    isUploading,
    isSaving,
    isSaveDisabled,
    setShowSaveConfirm,
    setIsEditingName,
    setIsEditingBio,
    setName,
    setBio,
    uploadAvatar,
    resetNameEdit,
    resetBioEdit,
    saveProfile,
  } = useMyProfileEditor({ userInfo, updateUserInfo });

  useEffect(() => {
    if (!accessToken) {
      navigate('/login', { state: { from: '/my' }, replace: true });
    }
  }, [accessToken, navigate]);

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
            isUploading={isUploading}
            onFileChange={uploadAvatar}
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
            onStopEdit={resetNameEdit}
          />

          <EditableField
            label="설명 (Bio, 선택)"
            value={bio}
            placeholder="소개를 입력해주세요"
            isEditing={isEditingBio}
            onChange={setBio}
            onStartEdit={() => setIsEditingBio(true)}
            onStopEdit={resetBioEdit}
          />
        </div>
      </div>

      <ConfirmModal
        open={showSaveConfirm}
        title="프로필을 저장하시겠습니까?"
        description="수정한 닉네임/설명/프로필 사진이 반영됩니다."
        confirmText="저장"
        cancelText="취소"
        loading={isSaving}
        onCancel={() => setShowSaveConfirm(false)}
        onConfirm={saveProfile}
      />
    </div>
  );
};

export default MyPage;

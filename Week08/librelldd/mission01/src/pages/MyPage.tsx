import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { useUpdateProfile } from "../hooks/useUpdateProfile.ts";
import { User, Mail, Calendar, LogOut, Settings, X, Camera, Save, Loader2 } from "lucide-react";

const MyPage = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 수정 폼 상태
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const updateProfileMutation = useUpdateProfile();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
    }
  };

  const openEditModal = () => {
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || "");
      setEditAvatar(user.avatar || "");
    }
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      alert("이름은 필수 항목입니다.");
      return;
    }

    updateProfileMutation.mutate(
      {
        name: editName.trim(),
        bio: editBio.trim() || undefined,
        avatar: editAvatar.trim() || undefined,
      },
      {
        onSuccess: (response) => {
          updateUser(response.data);
          alert("프로필이 수정되었습니다.");
          closeEditModal();
        },
        onError: () => {
          alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  if (!user) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
    </div>
  );

  return (
    <>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-10 tracking-tight">
          마이페이지
        </h1>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* 프로필 헤더 */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600" />
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="p-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={openEditModal}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>프로필 수정</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {user.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {user.bio || "자기소개가 없습니다."}
                </p>
              </div>

              <div className="grid gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">가입일: {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 백드롭 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeEditModal}
          />

          {/* 모달 창 */}
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            {/* 모달 헤더 */}
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  프로필 수정
                </h3>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* 모달 바디 */}
            <div className="px-6 pb-6 space-y-5">
              {/* 프로필 사진 URL */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <Camera className="w-4 h-4" />
                  <span>프로필 사진 URL</span>
                  <span className="text-xs text-gray-400 font-normal">(선택)</span>
                </label>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {editAvatar ? (
                      <img src={editAvatar} alt="미리보기" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="이미지 URL을 입력하세요"
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* 이름 (필수) */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4" />
                  <span>이름</span>
                  <span className="text-xs text-red-500 font-normal">*필수</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Bio (선택) */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <span>💬</span>
                  <span>자기소개</span>
                  <span className="text-xs text-gray-400 font-normal">(선택)</span>
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="자기소개를 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400"
                />
              </div>

              {/* 버튼 영역 */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={closeEditModal}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending || !editName.trim()}
                  className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>저장 중...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>저장</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyPage;
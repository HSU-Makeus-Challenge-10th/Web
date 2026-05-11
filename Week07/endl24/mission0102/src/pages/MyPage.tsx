import { useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProfileEditModal } from "../components/modal/ProfileEditModal";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

const MyPage = () => {
  const { isLoading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: userData } = useGetMyInfo(); 
  const user = userData?.data;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-16">
        <p className="text-red-500">유저 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-2xl">
              {user.name?.[0]}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 mt-1">
            {user.bio || "자기소개가 없습니다."}
          </p>
        </div>

        {/*설정 버튼 클릭 시 모달 오픈 */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
        >
          설정
        </button>
      </div>

      {/* 모달 컴포넌트 연결 */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
        }}
      />
    </div>
  );
};

export default MyPage;

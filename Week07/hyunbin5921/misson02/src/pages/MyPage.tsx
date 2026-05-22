import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // 🚨 useQueryClient 추가
import { getMyInfo, updateMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

// 🚨 MyInfo 데이터 구조를 가정 (실제 API 응답 구조에 맞게 조정 필요)
// 캐시에 저장되고 컴포넌트에 전달되는 사용자 데이터의 타입을 가정합니다.
interface MyInfoCacheData {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}
// MyPage 컴포넌트의 data 상태 타입
type ResponseMyInfoDto = MyInfoCacheData;

type UpdateMyInfoDto = {
  name: string;
  bio?: string | null;
  avatar?: string | null;
};

interface ProfileEditFormProps {
  initialData: MyInfoCacheData; // ResponseMyInfoDto["data"]를 MyInfoCacheData로 가정
  onClose: () => void;
  onSuccess: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialData,
  onClose,
  onSuccess,
}) => {
  // Bio와 Avatar는 null일 수 있으므로 빈 문자열로 초기화
  const [name, setName] = useState(initialData.name || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [avatar, setAvatar] = useState(initialData.avatar || ""); // profileImage 대신 avatar 변수 사용
  const [error, setError] = useState("");

  const queryClient = useQueryClient(); // 🚨 추가
  const { setUserName: setGlobalUserName } = useAuth(); // 🚨 추가: 전역 닉네임 상태 변경 함수

  // 1. 수정 Mutation 정의
  const updateMutation = useMutation({
    mutationFn: (data: UpdateMyInfoDto) => updateMyInfo(data),

    // 🚀 Optimistic Update 구현
    onMutate: async (newUserData) => {
      // 1. 기존 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });

      // 2. 이전 데이터 저장 (롤백용)
      const previousCacheData = queryClient.getQueryData<MyInfoCacheData>([
        "myInfo",
      ]);
      const previousGlobalName = initialData.name; // AuthContext 롤백용 이름

      // 3. 쿼리 데이터 낙관적 업데이트 (마이페이지 UI 즉시 변경)
      if (previousCacheData) {
        // 캐시 데이터에 새로운 닉네임, bio, avatar 적용
        queryClient.setQueryData<MyInfoCacheData>(["myInfo"], {
          ...previousCacheData,
          name: newUserData.name,
          // bio와 avatar는 payload에 따라 업데이트하거나 기존 값을 유지
          bio:
            newUserData.bio === undefined
              ? previousCacheData.bio
              : newUserData.bio,
          avatar:
            newUserData.avatar === undefined
              ? previousCacheData.avatar
              : newUserData.avatar,
        });
      }

      // 4. 전역 상태 (Nav-Bar 닉네임) 즉시 업데이트
      setGlobalUserName(newUserData.name);

      // 5. 롤백을 위해 이전 값 리턴
      return { previousCacheData, previousGlobalName };
    },

    onSuccess: () => {
      // 낙관적 업데이트로 UI는 이미 변경되었으므로, 성공 알림과 폼 닫기만 진행
      alert("프로필 정보가 성공적으로 수정되었습니다.");
      onSuccess(); // 마이페이지 데이터 refetch (MyPage의 getData 호출)
      onClose(); // 폼 닫기
    },

    // 🚨 롤백 로직 구현
    onError: (err, newUserData, context) => {
      // 1. 쿼리 데이터 롤백 (마이페이지 UI 롤백)
      if (context?.previousCacheData) {
        queryClient.setQueryData(["myInfo"], context.previousCacheData);
      }

      // 2. 전역 상태 롤백 (Nav-Bar UI 롤백)
      if (context?.previousGlobalName) {
        setGlobalUserName(context.previousGlobalName);
      }

      console.error("프로필 수정 실패:", err);
      const errorMessage =
        err.response?.data?.message ||
        "프로필 수정에 실패했습니다. (네트워크 또는 서버 오류)";
      setError(errorMessage);
    },

    // 🚨 최종 동기화
    onSettled: () => {
      // 성공/실패와 관계없이 쿼리 무효화 (서버 데이터로 최종 동기화 보장)
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() === "") {
      setError("이름은 필수로 입력해야 합니다.");
      return;
    }
    setError("");

    const payload: UpdateMyInfoDto = {
      name: name.trim(),
      bio: bio.trim() === "" ? null : bio.trim(),
      avatar: avatar.trim() === "" ? null : avatar.trim(),
    };

    updateMutation.mutate(payload);
  };

  return (
    <div className="profile-edit-form p-6 border rounded-lg shadow-md bg-white dark:bg-gray-700 space-y-4">
      <h2 className="text-xl font-bold dark:text-white">프로필 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 현재 프로필 이미지 미리보기 */}
        <div className="flex items-center space-x-4">
          <img
            src={avatar || "https://via.placeholder.com/150"}
            alt="Current Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <span className="text-sm text-gray-500 dark:text-gray-300">
            현재 프로필
          </span>
        </div>

        {/* 1. 이름 수정 (필수) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            이름 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={updateMutation.isPending}
          />
        </div>

        {/* 2. Bio 수정 (선택) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Bio (프로필 설명)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full p-2 border border-gray-300 rounded-md resize-none"
            placeholder="자신을 소개해주세요."
            disabled={updateMutation.isPending}
          />
        </div>

        {/* 3. 프로필 사진 URL (선택) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            프로필 사진 URL
          </label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="새로운 이미지 URL을 입력하세요."
            disabled={updateMutation.isPending}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={updateMutation.isPending}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={updateMutation.isPending || name.trim() === ""}
          >
            {updateMutation.isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
};
// ----------------------------------------------------

// ----------------------------------------------------
// 🏠 MyPage 컴포넌트
// ----------------------------------------------------
const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>();
  const [isEditing, setIsEditing] = useState(false); // 수정 폼 토글 상태

  // 1. 사용자 정보 가져오기 (Refetch 가능하도록 함수화)
  const getData = async () => {
    try {
      const response = await getMyInfo();
      // 🚨 응답 구조가 { data: { id, name, ... } } 라고 가정하고 setData 처리
      setData(response.data);
    } catch (error) {
      console.error("내 정보 로드 실패:", error);
      // 🚨 인증 오류 등으로 정보 로드 실패 시, 로그아웃 처리하거나 에러 메시지 표시 필요
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // 2. 로그아웃 핸들러
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // 3. 수정 완료 후 호출될 콜백 (데이터 갱신)
  const handleEditSuccess = () => {
    // 수정 성공 후, 최신 정보 다시 불러오기
    getData();
  };

  // 🚨 userData는 data.data를 가리킵니다.
  const userData = data;

  // 로딩/에러 상태 처리
  if (!data) {
    return <div className="max-w-xl mx-auto p-4">사용자 프로필 로딩 중...</div>;
  }

  if (!userData) {
    return (
      <div className="max-w-xl mx-auto p-4 text-red-500">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const defaultAvatar = "https://via.placeholder.com/150";

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg mt-10">
      {/* 4. 수정 폼 렌더링 (isEditing 상태에 따라 토글) */}
      {isEditing && userData ? (
        <ProfileEditForm
          initialData={userData}
          onClose={() => setIsEditing(false)}
          onSuccess={handleEditSuccess}
        />
      ) : (
        <div className="space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {userData.name}님 환영합니다.
          </h1>

          <div className="flex items-start space-x-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200">
            {/* 프로필 이미지 */}
            <div className="flex-shrink-0">
              <img
                src={userData.avatar || defaultAvatar}
                alt={`${userData.name}님의 프로필 아바타`}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-400"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error("Profile image failed to load:", target.src);
                  target.src = defaultAvatar;
                  target.onerror = null;
                }}
              />
            </div>

            {/* 이름, Bio, 이메일 영역 */}
            <div className="flex-1 space-y-1">
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {userData.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {userData.email}
              </p>

              {/* Bio (프로필 설명) */}
              {userData.bio && (
                <p className="text-base italic text-gray-500 dark:text-gray-400 pt-2">
                  {userData.bio}
                </p>
              )}
              {!userData.bio && (
                <p className="text-sm text-gray-400 dark:text-gray-500 pt-2">
                  Bio가 없습니다.
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* 설정 버튼 */}
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
            >
              ⚙️ 설정 (프로필 수정)
            </button>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;

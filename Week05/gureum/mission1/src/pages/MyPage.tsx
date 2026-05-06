import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyInfo } from '../api/auth';
import type { ResponseMyInfoDto } from '../types/auth';

type MyInfo = ResponseMyInfoDto['data'];

const MyPage = () => {
  const navigate = useNavigate();
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await getMyInfo();
        setMyInfo(response.data);
      } catch (err) {
        setError('내 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (error || !myInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-center relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="이전 페이지로 이동"
            className="absolute left-0 text-gray-700 hover:text-gray-500"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center">마이페이지</h1>
        </div>

        {/* 아바타 */}
        <div className="flex justify-center">
          {myInfo.avatar ? (
            <img
              src={myInfo.avatar}
              alt="프로필 이미지"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
              👤
            </div>
          )}
        </div>

        {/* 내 정보 */}
        <div className="flex flex-col gap-2">
          <InfoRow label="이름" value={myInfo.name} />
          <InfoRow label="이메일" value={myInfo.email} />
          <InfoRow label="한 줄 소개" value={myInfo.bio ?? '(없음)'} />
          <InfoRow
            label="가입일"
            value={new Date(myInfo.createdAt).toLocaleDateString('ko-KR')}
          />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2">
    <span className="text-gray-500 w-24 shrink-0">{label}</span>
    <span className="font-medium break-all">{value}</span>
  </div>
);

export default MyPage;

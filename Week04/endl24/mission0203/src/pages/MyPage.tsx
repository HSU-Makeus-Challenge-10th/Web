import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { LoadingSpinner } from "../components/LoadingSpinner";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error("정보를 가져오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const user = data?.data;

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="w-full max-w-sm bg-white p-10 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 shadow-lg">
          <span className="text-4xl font-bold text-white">
            {user?.name?.[0]}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {user?.name}
          </h2>
          <p className="text-sm font-medium text-blue-500 bg-blue-50 inline-block px-3 py-1 rounded-full">
            회원 번호 #{user?.id}
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col gap-4 text-left">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-medium">이름</span>
            <span className="text-base text-gray-700 font-semibold">
              {user?.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-medium">상태</span>
            <span className="text-sm text-green-500 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              인증됨
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

import { useEffect, useState } from "react";

const MyPage = () => {
  // 정보를 저장할 상태 (필요하다면 사용하세요)
  const [userInfo, setUserInfo] = useState<any>(null);

  // 1. 가짜 getMyInfo 함수 (실제 API가 있다면 import 하세요)
  const getMyInfo = async () => {
    return { name: "사용자", email: "user@example.com" };
  };

  useEffect(() => {
    // 2. useEffect 내부에서 비동기 함수 선언
    const getData = async () => {
      try {
        const response = await getMyInfo();
        console.log("내 정보 로딩 성공:", response);
        setUserInfo(response); // 상태에 저장
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    // 3. 선언한 함수를 즉시 실행
    getData();
  }, []); // []를 넣어야 페이지가 처음 뜰 때 한 번만 실행됩니다.

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h2 className="text-xl font-bold text-purple-500 mb-4">마이페이지</h2>
      {userInfo ? (
        <div className="bg-gray-900 p-5 rounded-md">
          <p>이름: {userInfo.name}</p>
          <p>이메일: {userInfo.email}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default MyPage;
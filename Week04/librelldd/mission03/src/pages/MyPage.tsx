import { useEffect, useState } from "react";

const MyPage = () => {

  const [userInfo, setUserInfo] = useState<any>(null);


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


    getData();
  }, []);

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
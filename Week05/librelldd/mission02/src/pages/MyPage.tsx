import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";
import type { ResponseMyInfoDto } from "../types/auth.ts"; 
import { useAuth } from "../context/AuthContext.tsx";

const MyPage = () => {
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        console.log(response);
        setData(response);
      } catch (e) { 
        console.error(e);
      }
    };

    getData();
  }, []); 

  const handleLogout = async () => {
    await logout();
  };


  if (!data) return null;

  return (
    <div>
      
      <h1>{data.data?.name}님 환영합니다.</h1>

      <img src={data.data?.avatar as string} alt={"프로필 이미지"} />
      <h1>{data.data?.email}</h1>

      <button
        className="cursor-pointer bg-purple-300 rounded-sm p-5 hover:scale-90"
        onClick={handleLogout}>
        로그아웃</button>
    </div>
  );
};

export default MyPage;
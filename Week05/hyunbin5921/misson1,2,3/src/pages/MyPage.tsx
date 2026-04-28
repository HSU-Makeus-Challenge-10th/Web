import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { type ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate()
    const {logout} = useAuth()
  const [data, setData] = useState<ResponseMyInfoDto>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }
return (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
    <div className="flex flex-col items-center gap-3 text-center">
      <img
        src={data.data?.avatar as string}
        alt={"구글 프로필 사진"}
        className="h-24 w-24 "
      />
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">{data.data?.name}님 환영합니다</h1>
        <p className="text-sm text-zinc-400">{data.data?.email}</p>
      </div>
      <button
        className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 transition"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  </div>
);
};

export default MyPage;
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";

const HomePage = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getMyInfo().then((res) => setUserName(res.data.name));
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <h1 className="text-5xl font-bold">
        {userName ? `${userName}님, 환영합니다!` : "로그인이 필요합니다."}
      </h1>
    </div>
  );
};

export default HomePage;
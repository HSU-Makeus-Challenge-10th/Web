import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [userName, setUserName] = useState<string>("");
  const { accessToken } = useAuth();

useEffect(() => {
    if (!accessToken) return;

    let mounted = true;

    (async () => {
      try {
        const res = await getMyInfo();
        if (mounted) setUserName(res.data.name);
      } catch {
        localStorage.removeItem("accessToken");
        if (mounted) setUserName("");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

return (
    <div className="flex items-center justify-center h-[80vh]">
      <h1 className="text-5xl font-bold">
        {!accessToken 
          ? "로그인이 필요합니다." 
          : userName 
            ? `${userName}님, 환영합니다!` 
            : "불러오는 중..."} 
      </h1>
    </div>
  );
};

export default HomePage;

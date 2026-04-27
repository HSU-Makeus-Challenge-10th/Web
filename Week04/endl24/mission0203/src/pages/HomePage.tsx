import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";

const HomePage = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

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

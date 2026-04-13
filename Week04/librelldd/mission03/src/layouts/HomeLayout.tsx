import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <nav>네비게이션 바 입니다.</nav>
      <main className="flec-1">
        <Outlet />
        </main>푸터
        </div>
  );
};

export default HomeLayout;
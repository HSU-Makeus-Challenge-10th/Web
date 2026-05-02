import { navigate } from "../App";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>홈 페이지입니다.</p>
      <button onClick={() => navigate("/mypage")}>Mypage로 이동</button>
    </div>
  );
}

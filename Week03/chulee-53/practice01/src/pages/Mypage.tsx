import { navigate } from "../App";

export default function Mypage() {
  return (
    <div>
      <h1>Mypage</h1>
      <p>마이 페이지입니다.</p>
      <button onClick={() => navigate("/")}>Home으로 이동</button>
    </div>
  );
}

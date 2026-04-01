import { navigate } from "../App";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>"{window.location.pathname}" 경로는 존재하지 않아요.</p>
      <button onClick={() => navigate("/")}>Home으로 이동</button>
    </div>
  );
}

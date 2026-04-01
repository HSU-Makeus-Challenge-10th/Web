import { useState, useEffect, type JSX } from "react";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import NotFound from "./pages/NotFount";

export function navigate(to: string) {
  window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

const routes: Record<string, JSX.Element> = {
  "/": <Home />,
  "/mypage": <Mypage />,
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return (
    <div>
      <nav>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/mypage")}>Mypage</button>
      </nav>

      {routes[path] ?? <NotFound />}
    </div>
  );
}
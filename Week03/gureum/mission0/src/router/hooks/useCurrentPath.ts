import { useEffect, useState } from "react";
import { getCurrentPath } from "../utils";

export const useCurrentPath = () => {
  const [path, setPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    const handlePathChange = () => setPath(getCurrentPath());

    window.addEventListener("popstate", handlePathChange);
    window.addEventListener("app:navigate", handlePathChange);

    return () => {
      window.removeEventListener("popstate", handlePathChange);
      window.removeEventListener("app:navigate", handlePathChange);
    };
  }, []);

  return path;
};

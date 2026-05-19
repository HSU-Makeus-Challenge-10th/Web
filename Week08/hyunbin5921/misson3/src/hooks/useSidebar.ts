import { useCallback, useEffect, useState } from "react";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // 🔥 ESC 닫기 + 배경 스크롤 방지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // 배경 스크롤 금지
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = ""; // 원래대로 복구
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // 클린업 필수
    };
  }, [isOpen, close]);

  return { isOpen, open, close, toggle };
}

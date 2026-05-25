import { useState, useCallback } from "react";

export function useSidebar(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);   // 모달을 열고 닫을 상태(State)를 추가

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
import { useState, useCallback } from "react";

export const useSidebar = (initialState = false) => {
    // 1. Sidebar의 열림/닫힘 상태 관리
    const [isOpen, setIsOpen] = useState<boolean>(initialState);

    // 2. Sidebar를 열 수 있는 open() 함수
    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    // 3. Sidebar를 닫을 수 있는 close() 함수
    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    // 4. Sidebar 상태를 토글할 수 있는 toggle() 함수
    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // 5. 만든 상태와 함수들을 객체 형태로 반환하여 재사용성 확보
    return {
        isOpen,
        open,
        close,
        toggle,
    };
};

export default useSidebar;
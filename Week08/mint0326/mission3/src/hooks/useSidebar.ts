import { useState, useEffect } from 'react';

export const useSidebar = (initialState: boolean = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    // 화면 크기에 따른 자동 토글 로직
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth > 1024;
            setIsDesktop(desktop);
            if (desktop) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    // ESC 키 입력 시 닫기 기능
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        // 클린업 함수
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // 배경 스크롤 방지 (overflow: hidden)
    useEffect(() => {
        // 모바일 환경에서 오버레이로 사이드바가 열려있을 때만 스크롤 방지
        if (isOpen && !isDesktop) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // 클린업 함수: 사이드바 언마운트 시 원래대로 복구
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isDesktop]);

    return { isOpen, open, close, toggle, setIsOpen, isDesktop };
};

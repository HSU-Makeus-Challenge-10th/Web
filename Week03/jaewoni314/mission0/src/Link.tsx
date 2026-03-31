import React, { type MouseEvent } from 'react';
import { getCurrentPath, navigateTo } from './utils.ts';

export interface LinkProps {
  to: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, children }) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 새로고침 방지
    if (getCurrentPath() === to) return; // 같은 경로라면 무시
    navigateTo(to); // pushState 호출하여 SPA 방식으로 이동
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

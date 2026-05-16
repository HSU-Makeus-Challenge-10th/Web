import { memo } from 'react';

interface MenuButtonProps {
  onClick: () => void;
  className?: string;
}

const MenuButton = ({ onClick, className }: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={
        className ??
        'text-white hover:text-pink-500 transition-colors cursor-pointer'
      }
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          d="M7.95 11.95h32m-32 12h32m-32 12h32"
        />
      </svg>
    </button>
  );
};

export default memo(MenuButton);

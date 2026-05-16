import { memo } from 'react';

interface BrandProps {
  onClick: () => void;
  title?: string;
}

const Brand = ({ onClick, title = 'WON LP' }: BrandProps) => {
  return (
    <button
      onClick={onClick}
      className="text-pink-500 font-bold text-[2vw] cursor-pointer"
    >
      {title}
    </button>
  );
};

export default memo(Brand);

import React from 'react';

interface LpImageDisplayProps {
  thumbnailUrl: string | null;
  onClick?: () => void;
  isSpinning?: boolean;
  size?: 'default' | 'small';
}

const LpImageDisplay: React.FC<LpImageDisplayProps> = ({
  thumbnailUrl,
  onClick,
  isSpinning = false,
  size = 'default',
}) => {
  //외부 원
  const outerContainerClasses =
    size === 'small' ? 'w-32 h-32' : 'w-[25vw] h-[25vw]';
  //내부 원
  const innerCircleClasses = size === 'small' ? 'w-8 h-8' : 'w-[6vw] h-[6vw]';

  return (
    <div className={`relative ${outerContainerClasses}`} onClick={onClick}>
      {thumbnailUrl ? (
        <>
          <img
            src={thumbnailUrl}
            alt="LP Thumbnail"
            className={`w-full h-full rounded-full object-cover shadow-2xl shadow-gray-900 ${
              isSpinning ? 'spinner' : ''
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${innerCircleClasses} bg-[#2c2c2c] shadow-xl rounded-full border-2 border-gray-600 `}
            />
          </div>
        </>
      ) : (
        <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center text-gray-400">
          LP 이미지
        </div>
      )}
    </div>
  );
};

export default LpImageDisplay;

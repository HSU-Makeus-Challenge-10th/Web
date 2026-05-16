import { useRef } from 'react';
import LpImageDisplay from '../lpImage/LpImageDisplay';

interface LpImageUploadProps {
  thumbnailUrl: string | null;
  onFileChange: (file: File) => void;
  isEditing?: boolean;
  size?: 'default' | 'small';
}

const LpImageUpload = ({
  thumbnailUrl,
  onFileChange,
  isEditing = true,
  size = 'default',
}: LpImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const containerClass =
    size === 'small'
      ? 'flex flex-col items-center'
      : 'flex justify-center my-[5vh]';

  return (
    <div className={containerClass}>
      <LpImageDisplay
        thumbnailUrl={thumbnailUrl}
        onClick={handleImageClick}
        isSpinning={!isEditing}
        size={size}
      />
      {isEditing && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      )}
    </div>
  );
};

export default LpImageUpload;

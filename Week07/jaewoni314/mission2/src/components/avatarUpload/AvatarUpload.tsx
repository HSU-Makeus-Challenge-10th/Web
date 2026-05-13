import { useRef } from 'react';
import { User } from 'lucide-react';

interface AvatarUploadProps {
  previewUrl: string | null;
  onFileChange: (file: File) => void;
  isEditing: boolean;
  alt?: string;
}

const AvatarUpload = ({
  previewUrl,
  onFileChange,
  isEditing,
  alt = 'Avatar',
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div className="relative">
      <div
        className={` w-24 h-24 rounded-full ${
          isEditing ? 'cursor-pointer' : ''
        }`}
        onClick={handleClick}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={alt}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {isEditing && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleClick}
        >
          <span className="text-xs text-white font-semibold">
            클릭하여 변경
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;

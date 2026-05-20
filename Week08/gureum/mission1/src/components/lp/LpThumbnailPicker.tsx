import { useRef } from 'react';

interface LpThumbnailPickerProps {
  thumbnail: string | null;
  isUploading: boolean;
  onFileChange: (file: File) => void;
}

const LpThumbnailPicker = ({ thumbnail, isUploading, onFileChange }: LpThumbnailPickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileChange(file);
    e.target.value = '';
  };

  return (
    <>
      <div className="flex justify-center">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="relative w-72 h-56 group">
          {thumbnail ? (
            <>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-gray-600 bg-black animate-[spin_8s_linear_infinite]">
                <div className="absolute inset-2 rounded-full bg-[repeating-radial-gradient(circle,_#0f172a_0_2px,_#111827_2px_4px)]" />
                <div className="absolute inset-[28%] rounded-full bg-gray-200" />
                <div className="absolute inset-[44%] rounded-full bg-gray-900 border border-gray-500" />
              </div>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-45 h-45 rounded-md overflow-hidden border border-gray-600 shadow-2xl bg-gray-800">
                <img src={thumbnail} alt="LP thumbnail" className="w-full h-full object-cover" />
              </div>
            </>
          ) : (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-gray-600 bg-black animate-[spin_8s_linear_infinite]">
              <div className="absolute inset-2 rounded-full bg-[repeating-radial-gradient(circle,_#0f172a_0_2px,_#111827_2px_4px)]" />
              <div className="absolute inset-[28%] rounded-full bg-gray-200" />
              <div className="absolute inset-[44%] rounded-full bg-gray-900 border border-gray-500" />
            </div>
          )}

          <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <span className="text-xs text-white opacity-0 group-hover:opacity-100 bg-black/60 px-2 py-1 rounded">이미지 선택</span>
          </div>
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {isUploading && <p className="text-xs text-center text-gray-400">이미지 업로드 중...</p>}
    </>
  );
};

export default LpThumbnailPicker;

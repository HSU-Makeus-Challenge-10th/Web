interface ProfileImageEditorProps {
  avatar: string | null;
  isUploading: boolean;
  onFileChange: (file: File) => void;
}

const ProfileImageEditor = ({ avatar, isUploading, onFileChange }: ProfileImageEditorProps) => {
  return (
    <div className="flex items-center gap-4">
      <img
        src={avatar ?? 'https://placehold.co/100x100/111/fff?text=ME'}
        alt="avatar"
        className="w-20 h-20 rounded-full object-cover border border-gray-700"
      />
      <div>
        <p className="text-sm text-gray-400 mb-1">프로필 사진 (선택)</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onFileChange(file);
            e.target.value = '';
          }}
          className="text-sm text-gray-300"
        />
        {isUploading && <p className="text-xs text-gray-500 mt-1">이미지 업로드 중...</p>}
      </div>
    </div>
  );
};

export default ProfileImageEditor;

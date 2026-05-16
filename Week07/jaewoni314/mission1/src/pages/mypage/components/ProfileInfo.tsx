interface ProfileInfoProps {
  name: string;
  email: string;
  bio: string | null;
  isEditing: boolean;
  onNameChange: (name: string) => void;
  onBioChange: (bio: string) => void;
}

const ProfileInfo = ({
  name,
  email,
  bio,
  isEditing,
  onNameChange,
  onBioChange,
}: ProfileInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="text-2xl font-bold bg-gray-700 border rounded px-2 py-1 w-full text-white"
            placeholder="이름을 입력하세요"
          />
        ) : (
          <h2 className="text-2xl font-bold">{name}</h2>
        )}
        <p className="text-gray-400 mt-1">{email}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">한 줄 소개</h3>
        {isEditing ? (
          <textarea
            value={bio || ''}
            onChange={(e) => onBioChange(e.target.value)}
            className="w-full p-3 bg-gray-700 border rounded text-white"
            rows={4}
            placeholder="자기소개를 입력하세요"
          />
        ) : (
          <p className="text-gray-300">{bio || '아직 소개가 없습니다.'}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;

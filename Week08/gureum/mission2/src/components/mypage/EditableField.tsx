interface EditableFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

const PencilIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const EditableField = ({
  label,
  value,
  placeholder,
  isEditing,
  onChange,
  onStartEdit,
  onStopEdit,
}: EditableFieldProps) => {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={!isEditing}
          placeholder={placeholder}
          className={`w-full rounded border px-3 py-2 pr-10 text-white ${isEditing ? 'bg-gray-800 border-pink-500' : 'bg-gray-800 border-gray-700'}`}
        />
        <button
          type="button"
          onClick={isEditing ? onStopEdit : onStartEdit}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
          aria-label={isEditing ? `${label} 편집 종료` : `${label} 수정`}
        >
          {isEditing ? <span className="text-lg leading-none">×</span> : <PencilIcon />}
        </button>
      </div>
    </div>
  );
};

export default EditableField;

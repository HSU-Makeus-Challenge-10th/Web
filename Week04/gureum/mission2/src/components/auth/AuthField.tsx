interface AuthFieldProps {
  type: 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
}

const AuthField = ({
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: AuthFieldProps) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 bg-transparent border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-600 focus:border-pink-500 focus:ring-pink-500'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AuthField;

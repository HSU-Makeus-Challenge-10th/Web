interface SocialLoginButtonProps {
  label: string;
}

const SocialLoginButton = ({ label }: SocialLoginButtonProps) => {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white hover:bg-gray-800 transition-colors"
    >
      <span className="mr-2 text-blue-400 font-semibold">G</span>
      {label}
    </button>
  );
};

export default SocialLoginButton;

import { FcGoogle } from 'react-icons/fc';

interface SocialLoginButtonProps {
  label: string;
  onClick?: () => void;
}

const SocialLoginButton = ({ label, onClick }: SocialLoginButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white hover:bg-gray-800 transition-colors"
    >
      <FcGoogle className="mr-2 text-xl" />
      {label}
    </button>
  );
};

export default SocialLoginButton;

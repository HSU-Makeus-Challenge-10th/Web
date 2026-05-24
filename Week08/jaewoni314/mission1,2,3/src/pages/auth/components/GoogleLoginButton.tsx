import Button from '../../../components/button/Button';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/google/login`;
  };

  return (
    <>
      <Button
        variant="secondary"
        fullWidth
        className="mb-4"
        onClick={handleGoogleLogin}
      >
        구글 로그인
      </Button>

      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 border-t border-gray-700" />
        <span className="text-gray-400 text-sm">OR</span>
        <div className="flex-1 border-t border-gray-700" />
      </div>
    </>
  );
};

export default GoogleLoginButton;

import Button from '../button/Button';

const GoogleLoginButton = () => {
  return (
    <>
      <Button variant="secondary" fullWidth className="mb-4">
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

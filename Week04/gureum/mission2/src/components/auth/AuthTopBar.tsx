interface AuthTopBarProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const AuthTopBar = ({ onLoginClick, onSignupClick }: AuthTopBarProps) => {
  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-pink-500 text-xl font-bold">돌려돌려 LP판</h1>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={onLoginClick}
          className="text-white px-3 py-1 border border-gray-600 rounded text-sm hover:bg-gray-800"
        >
          로그인
        </button>
        <button
          type="button"
          onClick={onSignupClick}
          className="bg-pink-500 text-white px-3 py-1 rounded text-sm hover:bg-pink-600"
        >
          회원가입
        </button>
      </div>
    </header>
  );
};

export default AuthTopBar;

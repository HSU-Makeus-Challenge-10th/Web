import { useNavigate } from 'react-router-dom';
import Button from '../components/button/Button';
import { useLogin } from '../hooks/useLogin';

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useLogin();

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4">
      <h1
        onClick={() => navigate('/')}
        className="text-pink-500 font-bold text-lg cursor-pointer"
      >
        돌려돌려 LP
      </h1>
      <div className="flex gap-2">
        <Button variant="primary" onClick={async () => await logout()}>
          로그아웃
        </Button>
        <Button variant="secondary" onClick={() => navigate('/login')}>
          로그인
        </Button>
        <Button variant="primary" onClick={() => navigate('/signup')}>
          회원가입
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;

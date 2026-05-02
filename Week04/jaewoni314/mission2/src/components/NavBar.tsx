import { useNavigate } from 'react-router-dom';
import Button from './button/Button';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4">
      <h1
        onClick={() => navigate('/')}
        className="text-pink-500 font-bold text-lg cursor-pointer"
      >
        돌려돌려LP판
      </h1>
      <div className="flex gap-2">
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

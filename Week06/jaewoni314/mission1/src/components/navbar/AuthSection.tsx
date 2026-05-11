import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import { useLogin } from '../../hooks/useLogin';
import { useAuth } from '../../hooks/useAuth';

const AuthSection = () => {
  const navigate = useNavigate();
  const { logout } = useLogin();
  const { isLoggedIn, user } = useAuth();

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-[1vw]">
        <Button variant="ghost">{user.name}님 안녕하세요</Button>
        <Button variant="primary" onClick={async () => await logout()}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[1vw]">
      <Button variant="secondary" onClick={() => navigate('/login')}>
        로그인
      </Button>
      <Button variant="primary" onClick={() => navigate('/signup')}>
        회원가입
      </Button>
    </div>
  );
};

export default AuthSection;

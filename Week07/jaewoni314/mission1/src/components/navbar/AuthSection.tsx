import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import { useAuth } from '../../hooks/auth/useAuth';
import { useLogoutMutation } from '../../hooks/auth/useLogoutMutation';

const AuthSection = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { mutate: logout } = useLogoutMutation();

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-[1vw]">
        <Button variant="ghost">{user.name}님 안녕하세요</Button>
        <Button variant="primary" onClick={() => logout()}>
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

import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Animation from '../../../components/animation/Animation';
import LoginForm from './components/LoginForm';
import { useLogin } from '../../../hooks/useLogin';
import type { LoginData } from '../../../types/auth/login';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { login } = useLogin();

  const handleLogin = async (data: LoginData) => {
    await login(data);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Animation>
        <header className="relative flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute left-0 text-xl p-2"
          >
            &lt;
          </Button>
          <h2 className="text-xl font-bold">로그인</h2>
        </header>
      </Animation>
      <Animation className="mt-8">
        <LoginForm onSubmit={handleLogin} />
      </Animation>
    </div>
  );
};

export default LoginPage;

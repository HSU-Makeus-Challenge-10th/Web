import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/button/Button';
import LoginForm from './components/LoginForm';
import type { LoginFormValues } from '../../utils/validate';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (data: LoginFormValues) => {
    console.log('로그인:', data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm"
      >
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
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-sm p-6"
      >
        <LoginForm onSubmit={handleLogin} />
      </motion.div>
    </div>
  );
};

export default LoginPage;

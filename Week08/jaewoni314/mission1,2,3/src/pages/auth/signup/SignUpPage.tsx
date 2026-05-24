import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Animation from '../../../components/animation/Animation';
import SignUpForm from './components/SignUpForm';
import type { SignUpRequestBody } from '../../../types/auth/signup';
import { useSignUpMutation } from '../../../hooks/auth/useSignUpMutation';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { mutate: signUp } = useSignUpMutation();

  const handleSignUpComplete = (data: SignUpRequestBody) => {
    signUp(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Animation direction="y" duration={0.2}>
        <div className="w-full max-w-sm">
          <header className="relative flex items-center justify-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="absolute left-0 text-xl p-2"
            >
              &lt;
            </Button>
            <h2 className="text-xl font-bold">회원가입</h2>
          </header>
        </div>
      </Animation>

      <Animation>
        <SignUpForm onComplete={handleSignUpComplete} />
      </Animation>
    </div>
  );
};

export default SignUpPage;

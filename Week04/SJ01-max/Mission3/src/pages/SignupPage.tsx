import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1Email from '../components/signup/Step1Email';
import Step2Password from '../components/signup/Step2Password';
import Step3Nickname from '../components/signup/Step3Nickname';

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStep1Next = (inputEmail: string) => {
    setEmail(inputEmail);
    setStep(2);
  };

  const handleStep2Next = (inputPassword: string) => {
    setPassword(inputPassword);
    setStep(3);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
      {step === 1 && (
        <Step1Email
          onNext={handleStep1Next}
          onBack={() => navigate(-1)}
        />
      )}
      {step === 2 && (
        <Step2Password
          email={email}
          onNext={handleStep2Next}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3Nickname
          email={email}
          password={password}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}

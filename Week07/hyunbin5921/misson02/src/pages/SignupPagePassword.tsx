import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { FormFields } from "./SignupPage";

type Props = {
  onBack?: () => void;
  onSubmit: () => void;
};

const SignupPagePassword = ({ onSubmit }: Props) => {
  const {
    register,
    formState: { errors, isSubmitting, touchedFields },
    trigger,
    control,
  } = useFormContext<FormFields>();

  const emailValue = useWatch({
    control,
    name: "email",
    defaultValue: "",
  }) as string;

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  }) as string;
  const passwordCheckValue = useWatch({
    control,
    name: "passwordCheck",
    defaultValue: "",
  }) as string;

  const touchedPassword = Boolean(
    (touchedFields as Partial<FormFields>)?.password
  );
  const touchedPasswordCheck = Boolean(
    (touchedFields as Partial<FormFields>)?.passwordCheck
  );

  const isDisabled = Boolean(
    isSubmitting ||
      !String(passwordValue ?? "").trim() ||
      !String(passwordCheckValue ?? "").trim() ||
      !!errors.password ||
      !!errors.passwordCheck
  );

  const handleNext = async () => {
    const ok = await trigger(["password", "passwordCheck"]);
    if (!ok) return;
    onSubmit(); // 검증 통과하면 SignupPage에서 스탭 변경 (password -> name)
  };

  // 보이게/안보이게 토글
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {emailValue ? (
        <div className="text-md text-white">📩 {emailValue}</div>
      ) : null}

      <div className="relative">
        <input
          {...register("password")}
          className={`text-white border w-[300px] p-[8px] rounded-sm placeholder:text-gray-400 bg-transparent ${
            errors?.password && touchedPassword
              ? "border-red-500"
              : "border-gray-300"
          }`}
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호를 입력해주세요!"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-pressed={showPassword}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-200 bg-transparent px-2 py-1"
        >
          {showPassword ? "숨기기" : "보기"}
        </button>
      </div>
      {touchedPassword && errors.password && (
        <div className="text-red-500 text-sm">
          {String(errors.password.message)}
        </div>
      )}

      <div className="relative">
        <input
          {...register("passwordCheck")}
          className={`text-white border w-[300px] p-[8px] rounded-sm placeholder:text-gray-400 bg-transparent ${
            errors?.passwordCheck && touchedPasswordCheck
              ? "border-red-500"
              : "border-gray-300"
          }`}
          type={showPasswordCheck ? "text" : "password"}
          placeholder="비밀번호를 다시 한번 입력해주세요!"
        />
        <button
          type="button"
          onClick={() => setShowPasswordCheck((s) => !s)}
          aria-pressed={showPasswordCheck}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-200 bg-transparent px-2 py-1"
        >
          {showPasswordCheck ? "숨기기" : "보기"}
        </button>
      </div>
      {touchedPasswordCheck && errors.passwordCheck && (
        <div className="text-red-500 text-sm">
          {String(errors.passwordCheck.message)}
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={isDisabled}
        className={`flex-1 bg-pink-500 text-white py-2 rounded-md ${
          isDisabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        다음
      </button>
    </div>
  );
};

export default SignupPagePassword;

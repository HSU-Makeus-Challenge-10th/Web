import { useFormContext, useWatch } from "react-hook-form";
import type { FormFields } from "./SignupPage";

type Props = { onNext: () => void };

const SignupPageEmail = ({ onNext }: Props) => {
  const methods = useFormContext<FormFields>();
  const {
    register,
    formState: { errors, isSubmitting },
    trigger,
    control,
    getValues,
  } = methods;

  // useWatch로 구독하고, 없으면 getValues로 폴백 -> 항상 문자열 보장
  const watched = useWatch({ control, name: "email" }) as string | undefined;
  const emailValue = (
    watched ??
    (getValues("email") as string | undefined) ??
    ""
  ).trim();

  const isDisabled = Boolean(
    isSubmitting || !!errors.email || emailValue === ""
  );

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={false}
        className="w-full text-white border border-gray-200 py-3 rounded-md text-lg font-medium transition-colors cursor-pointer hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed flex items-center justify-center relative"
      >
        <img
          src="https://img.icons8.com/color/512/google-logo.png"
          className="w-6 h-6 absolute left-4"
        />
        구글 로그인
      </button>

      <div className="relative flex justify-center py-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative bg-black px-10 text-sm text-white z-10">
          OR
        </div>
      </div>

      <input
        {...register("email")}
        className={`text-white border w-[300px] p-[8px] rounded-sm placeholder:text-gray-400 bg-transparent ${
          errors?.email ? "border-red-500" : "border-gray-300"
        }`}
        type="email"
        placeholder="이메일을 입력해주세요!"
        aria-invalid={!!errors.email}
      />
      {errors.email && (
        <div className="text-red-500 text-sm">
          {String(errors.email.message)}
        </div>
      )}

      <button
        type="button"
        onClick={async () => {
          if (isDisabled) return;
          const valid = await trigger("email");
          if (valid) onNext();
        }}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={`w-full bg-pink-500 text-white py-3 rounded-md cursor-pointer ${
          isDisabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        다음
      </button>
    </div>
  );
};

export default SignupPageEmail;

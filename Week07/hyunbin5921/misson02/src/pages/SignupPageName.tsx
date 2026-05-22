import { useFormContext } from "react-hook-form";
import type { FormFields } from "./SignupPage";

type Props = {
  onBack?: () => void;
  onSubmit: () => Promise<void>;
};

const SignupPageName = ({ onBack, onSubmit }: Props) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<FormFields>();

  const handleNext = async () => {
    try {
      console.log("submitting name form...");
      await onSubmit();
    } catch (err) {
      console.error("name submit failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        {...register("name")}
        className={`text-white border w-[300px] p-[8px] rounded-sm placeholder:text-gray-400 ${
          errors?.name ? "border-red-500" : "border-gray-300"
        }`}
        type="text"
        placeholder="이름을 입력해주세요!"
      />
      {errors.name && (
        <div className="text-red-500 text-sm">{errors.name.message}</div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-700 text-white py-2 rounded-md"
        >
          뒤로
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex-1 bg-pink-500 text-white py-2 rounded-md disabled:opacity-50"
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default SignupPageName;

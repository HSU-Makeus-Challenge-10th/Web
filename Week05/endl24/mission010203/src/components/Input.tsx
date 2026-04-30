import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  registration: UseFormRegisterReturn;
  error?: FieldError;
  rightElement?: React.ReactNode; 
}

export const Input = ({ registration, error, rightElement, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative w-full">
        <input
          {...registration}
          {...props}
          className={`border w-full p-2 focus:border-[#807bff] rounded-md transition-colors ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {rightElement && (
          <div className="absolute right-2 top-2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};
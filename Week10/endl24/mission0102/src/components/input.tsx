import { memo } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
}

export const Input = memo(({
  value,
  onChange,
  onSubmit,
  placeholder = "검색어를 입력하세요.",
  className = "",
}: InputProps) => {
  
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        className={`w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-800 transition-all duration-300 placeholder:font-medium placeholder:text-zinc-400 hover:border-zinc-300 hover:bg-zinc-100 hover:shadow-md focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/20 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="hidden" />
    </form>
  );
});

Input.displayName = "Input";
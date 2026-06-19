import React from "react";

interface LanguageOption {
  value: string;
  label: string;
}

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: LanguageOption[];
  className?: string;
}

const LanguageSelector = ({
  value,
  onChange,
  options,
  className = "",
}: LanguageSelectorProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full cursor-pointer rounded-2xl border-2 border-zinc-200 bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-800 transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-100 hover:shadow-md focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/20 active:scale-[0.98] ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default React.memo(LanguageSelector);
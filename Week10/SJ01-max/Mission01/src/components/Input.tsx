import { memo } from "react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ value, onChange }: InputProps) {
  console.log("Input 렌더링");

  return (
    <input
      value={value}
      onChange={onChange}
      placeholder="영화 제목을 입력하세요"
      className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
    />
  );
}

export default memo(Input);

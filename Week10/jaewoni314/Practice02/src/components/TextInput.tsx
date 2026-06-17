import { memo } from "react";

interface TextInputProps {
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TextInput({ text, onChange }: TextInputProps) {
  console.log("TextInput 렌더링");

  return (
    <input
      type="number"
      value={text}
      onChange={onChange}
      placeholder="숫자 입력"
    />
  );
}

export default memo(TextInput);

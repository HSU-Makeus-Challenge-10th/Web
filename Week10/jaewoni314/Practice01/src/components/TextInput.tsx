import { memo } from "react";

interface TextInputProps {
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TextInput({ text, onChange }: TextInputProps) {
  console.log("TextInput 렌더링");

  return <input value={text} onChange={onChange} placeholder="텍스트 입력" />;
}

export default memo(TextInput);

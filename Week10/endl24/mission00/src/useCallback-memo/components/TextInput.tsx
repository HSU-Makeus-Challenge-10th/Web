import { memo } from "react";

interface ItextInput {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ItextInput) => {
  console.log("TextInput rendered");

  return (
    <input
      type="text"
      className="border p-4 rounded-lg"
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default memo(TextInput);

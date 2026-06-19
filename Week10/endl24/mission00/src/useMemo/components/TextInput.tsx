interface ItextInput {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ItextInput) => {
  return (
    <input
      type="text"
      className="border p-4 rounded-lg"
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextInput;

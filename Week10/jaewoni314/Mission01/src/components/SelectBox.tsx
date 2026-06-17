interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectBoxProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}

function SelectBox<T extends string>({
  value,
  options,
  onChange,
}: SelectBoxProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SelectBox;

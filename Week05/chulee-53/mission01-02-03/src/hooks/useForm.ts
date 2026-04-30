import { useMemo, useState } from "react";

interface UseFormProps<T> {
  initialValues: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const error = useMemo(() => validate(values), [validate, values]);

  const handleChange = (name: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => handleChange(name, e.target.value);

    return {
      value,
      onChange,
    };
  };

  return {
    values,
    error,
    getInputProps,
  };
}

export default useForm;

import { useEffect, useState } from "react";

interface UseFormProps<T> {
  initialValues: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [error, setError] = useState<Record<keyof T, string>>();

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

  useEffect(() => {
    const errors = validate(values);
    setError(errors);
  }, [validate, values]);

  return {
    values,
    error,
    getInputProps,
  };
}

export default useForm;

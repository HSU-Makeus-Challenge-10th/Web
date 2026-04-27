import { useState, useEffect } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  validate: (values: T) => Partial<Record<keyof T, string>>;
}

const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // 실시간 유효성 검사
  useEffect(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [values, validate]);

  const handleChange = (name: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // 폼 전체 유효성 여부
  const isValid = Object.values(errors).every((error) => !error);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
  };
};

export default useForm;

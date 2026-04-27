import { useState, useCallback, type ChangeEvent } from 'react';

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

interface UseFormOptions<T> {
  initialValues: T;
  validate: Validator<T>;
}

function useForm<T extends Record<string, string> & { [key: string]: string }>({
  initialValues,
  validate,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newValues = { ...values, [name]: value } as T;
      setValues(newValues);
      if (touched[name as keyof T]) {
        setErrors(validate(newValues));
      }
    },
    [values, touched, validate],
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors(validate(values));
    },
    [values, validate],
  );

  const isValid = Object.keys(initialValues).every((key) => {
    const k = key as keyof T;
    return values[k].length > 0 && !validate(values)[k];
  });

  return { values, errors, touched, handleChange, handleBlur, isValid, setValues, setErrors, setTouched };
}

export default useForm;

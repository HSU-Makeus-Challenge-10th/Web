import { useState, useCallback, type ChangeEvent } from 'react';

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

interface UseFormOptions<T> {
  initialValues: T;
  validate: Validator<T>;
}

function useForm<T extends Record<string, string> & { [key: string]: string }>({ initialValues, validate }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newValues = { ...values, [name]: value } as T;
      setValues(newValues);

      // 터치된 필드만 실시간 유효성 검사
      if (touched[name as keyof T]) {
        const newErrors = validate(newValues);
        setErrors(newErrors);
      }
    },
    [values, touched, validate],
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      const newTouched = { ...touched, [name]: true } as Partial<Record<keyof T, boolean>>;
      setTouched(newTouched);

      const newErrors = validate(values);
      setErrors(newErrors);
    },
    [touched, values, validate],
  );

  const isValid = Object.keys(initialValues).every((key) => {
    const k = key as keyof T;
    return values[k].length > 0 && !validate(values)[k];
  });

  return { values, errors, touched, handleChange, handleBlur, isValid };
}

export default useForm;

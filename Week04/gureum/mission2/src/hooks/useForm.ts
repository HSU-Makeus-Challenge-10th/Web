import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';

type FormErrors<T> = Partial<Record<keyof T, string>>;
type TouchedMap<T> = Record<keyof T, boolean>;

interface UseFormOptions<T extends Record<string, string>> {
  initialValues: T;
  validate: (values: T) => FormErrors<T>;
}

export const useForm = <T extends Record<string, string>>({
  initialValues,
  validate,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<TouchedMap<T>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as TouchedMap<T>)
  );

  const errors = useMemo(() => validate(values), [validate, values]);

  const setFieldValue = <K extends keyof T>(name: K, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldTouched = <K extends keyof T>(name: K) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getFieldProps = <K extends keyof T>(name: K) => ({
    value: values[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(name, event.target.value);
    },
    onBlur: () => {
      setFieldTouched(name);
    },
  });

  const isFormValid = useMemo(() => {
    const hasEmptyValue = Object.values(values).some((value) => !value.trim());
    const hasError = Object.values(errors).some((errorMessage) => Boolean(errorMessage));
    return !hasEmptyValue && !hasError;
  }, [errors, values]);

  return {
    values,
    touched,
    errors,
    isFormValid,
    getFieldProps,
  };
};

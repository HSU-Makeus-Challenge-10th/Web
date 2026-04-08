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
  // values: 실제 입력값, touched: 사용자가 한 번이라도 건드린 필드 표시
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<TouchedMap<T>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as TouchedMap<T>)
  );

  // 값이 바뀔 때마다 검증 함수를 돌려 최신 에러 상태를 계산합니다.
  const errors = useMemo(() => validate(values), [validate, values]);

  const setFieldValue = <K extends keyof T>(name: K, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldTouched = <K extends keyof T>(name: K) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // input 바인딩을 통일해 페이지에서 중복 코드를 줄입니다.
  const getFieldProps = <K extends keyof T>(name: K) => ({
    value: values[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(name, event.target.value);
    },
    onBlur: () => {
      setFieldTouched(name);
    },
  });

  // "빈 값 없음 + 에러 없음"일 때만 제출 버튼을 활성화합니다.
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

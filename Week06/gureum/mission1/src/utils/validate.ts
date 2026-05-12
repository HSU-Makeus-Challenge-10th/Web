export type UserSigninInformation = {
  email: string;
  password: string;
};

function validateUser(values: UserSigninInformation): Record<keyof UserSigninInformation, string> {
  const errors = {
    email: '',
    password: '',
  };

  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
      values.email,
    )
  ) {
    errors.email = '이메일 형식이 올바르지 않습니다.';
  }

  if (values.password.length < 6 || values.password.length > 20) {
    errors.password = '비밀번호는 최소 6~20자 사이로 입력해야 합니다.';
  }

  return errors;
}

function validateSignin(values: UserSigninInformation) {
  return validateUser(values);
}

export type UserSignupInformation = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

function validateSignup(
  values: UserSignupInformation,
): Record<keyof UserSignupInformation, string> {
  const errors = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  if (!values.name || values.name.trim().length < 1) {
    errors.name = '닉네임을 입력해주세요.';
  } else if (values.name.trim().length > 20) {
    errors.name = '닉네임은 20자 이하로 입력해주세요.';
  }

  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
      values.email,
    )
  ) {
    errors.email = '이메일 형식이 올바르지 않습니다.';
  }

  if (values.password.length < 6 || values.password.length > 20) {
    errors.password = '비밀번호는 최소 6~20자 사이로 입력해야 합니다.';
  }

  if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  }

  return errors;
}

export { validateSignin, validateSignup };

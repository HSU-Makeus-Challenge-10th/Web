// 유효성 검사 에러 메시지 상수
// UI 코드와 비즈니스 로직을 분리하기 위해 메시지를 한 곳에서 관리합니다.

export const VALIDATION_MESSAGES = {
  email: {
    required: '이메일을 입력해주세요.',
    invalid: '올바른 이메일 형식을 입력해주세요.',
  },
  password: {
    required: '비밀번호를 입력해주세요.',
    minLength: '비밀번호는 8자 이상이어야 합니다.',
    mismatch: '비밀번호가 일치하지 않습니다',
  },
  confirmPassword: {
    required: '비밀번호 확인을 입력해주세요.',
  },
  nickname: {
    required: '닉네임을 입력해주세요.',
    maxLength: '닉네임은 20자 이하여야 합니다.',
  },
} as const;

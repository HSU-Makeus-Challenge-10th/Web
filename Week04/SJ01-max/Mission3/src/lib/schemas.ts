import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '../utils/validationMessages';

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, MSG.email.required)
    .email(MSG.email.invalid),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(1, MSG.password.required)
      .min(8, MSG.password.minLength),
    confirmPassword: z
      .string()
      .min(1, MSG.confirmPassword.required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MSG.password.mismatch,
    path: ['confirmPassword'],
  });

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, MSG.nickname.required)
    .max(20, MSG.nickname.maxLength),
});

// 로그인 스키마 (LoginPage에서 인라인으로 쓰던 것을 이곳으로 통합)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, MSG.email.required)
    .email(MSG.email.invalid),
  password: z
    .string()
    .min(1, MSG.password.required)
    .min(8, MSG.password.minLength),
});

// TypeScript 타입 추출
export type EmailFormValues = z.infer<typeof emailSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type NicknameFormValues = z.infer<typeof nicknameSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;

// 토큰 저장 타입
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

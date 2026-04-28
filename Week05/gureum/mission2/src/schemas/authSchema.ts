import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .email('올바른 이메일 형식을 입력해주세요.');

export const passwordSchema = z
  .string()
  .min(1, '비밀번호를 입력해주세요.')
  .min(6, '비밀번호는 6자 이상이어야 합니다.');

export const confirmPasswordSchema = z
  .string()
  .min(1, '비밀번호를 다시 입력해주세요.')
  .min(6, '비밀번호는 6자 이상이어야 합니다.');

export const nicknameSchema = z
  .string()
  .min(1, '닉네임을 입력해주세요.')
  .min(2, '닉네임은 2자 이상이어야 합니다.')
  .max(20, '닉네임은 20자 이하여야 합니다.');

export const signupBaseSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  nickname: nicknameSchema,
});

export const signupStepOneSchema = signupBaseSchema.pick({
  email: true,
});

export const signupStepTwoSchema = signupBaseSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = signupBaseSchema
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

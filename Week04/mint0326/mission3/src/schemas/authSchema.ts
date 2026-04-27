import { z } from 'zod';

const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .email('올바른 이메일 형식을 입력해주세요.');

const passwordSchema = z
  .string()
  .min(1, '비밀번호를 입력해주세요.')
  .min(6, '비밀번호는 최소 6자 이상이어야 합니다.');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  passwordConfirm: z.string().min(1, '비밀번호를 다시 한 번 입력해주세요.'),
  nickname: z.string().min(1, '닉네임을 입력해주세요.').min(2, '닉네임은 최소 2자 이상이어야 합니다.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordConfirm"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;

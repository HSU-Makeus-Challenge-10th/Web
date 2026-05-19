import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, { message: '이메일을 입력해주세요.' })
  .email({ message: '유효한 이메일 주소를 입력해주세요.' });

export const passwordSchema = z
  .string()
  .min(1, { message: '비밀번호를 입력해주세요.' })
  .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
  .max(16, '비밀번호는 16자 이하여야 합니다.');

// 로그인 스키마
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z
      .string()
      .min(1, { message: '비밀번호를 다시 입력해주세요.' }),
    name: z.string().min(1, { message: '닉네임을 입력해주세요.' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

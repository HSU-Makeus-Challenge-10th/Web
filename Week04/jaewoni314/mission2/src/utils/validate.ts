import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요.' })
    .email({ message: '유효한 이메일 주소를 입력해주세요.' }),
  password: z
    .string()
    .min(1, { message: '비밀번호를 입력해주세요.' })
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .max(16, '비밀번호는 16자 이하여야 합니다.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

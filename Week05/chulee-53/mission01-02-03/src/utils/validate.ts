import z from "zod";

const validators = {
  email: (value: string) => {
    if (!value) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "올바른 이메일 형식을 입력해주세요.";
    return "";
  },
  password: (value: string) => {
    if (!value) return "";
    if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    return "";
  },
};

export type UserSigninInformation = {
  email: string;
  password: string;
};

export type UserSignupInformation = {
  email: string;
};

export function validateSignin(values: UserSigninInformation) {
  return {
    email: validators.email(values.email),
    password: validators.password(values.password),
  };
}

export function validateSignup(values: UserSignupInformation) {
  return {
    email: validators.email(values.email),
  };
}

export const signupSchema = z.object({
    name: z
        .string()
        .min(1, { message: "이름을 입력해주세요." }),
    email: z
        .string()
        .email({ message: "올바른 이메일 형식을 입력해주세요." }),
    password: z
        .string()
        .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
        .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
        .string()
        .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
        .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
}).refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ['passwordCheck'],
});

export type SignupFormFields = z.infer<typeof signupSchema>;

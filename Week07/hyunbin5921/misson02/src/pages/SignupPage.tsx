import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupPageEmail from "./SignupPageEmail";
import SignupPagePassword from "./SignupPagePassword";
import SignupPageName from "./SignupPageName";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

export type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const methods = useForm<FormFields>({
    defaultValues: { name: "", email: "", password: "", passwordCheck: "" },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const navigate = useNavigate();

  // 검증 통과 시 post하고 홈으로 이동 (SignupPageName에서 호출)
  const submitAndNavigate = methods.handleSubmit(async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordCheck, ...rest } = data;
    await postSignup(rest);
    navigate("/");
  });

  const [step, setStep] = useState<"email" | "password" | "name">("email");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-black">
      <div className="flex flex-col gap-3">
        <div className="text-xl font-bold flex items-center justify-between relative py-5">
          <Link to="/" className="cursor-pointer text-white">
            &lt;
          </Link>
          <span className="absolute left-1/2 transform -translate-x-1/2 text-white">
            회원가입
          </span>
        </div>

        <FormProvider {...methods}>
          <form>
            {step === "email" && (
              <SignupPageEmail onNext={() => setStep("password")} />
            )}
            {step === "password" && (
              <SignupPagePassword
                onSubmit={() => setStep("name")}
                onBack={() => setStep("email")}
              />
            )}
            {step === "name" && (
              <SignupPageName
                onBack={() => setStep("password")}
                onSubmit={submitAndNavigate}
              />
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SignupPage;

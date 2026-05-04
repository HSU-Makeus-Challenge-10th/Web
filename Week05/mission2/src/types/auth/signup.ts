export interface SignUpFormValues {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  bio?: string;
  avatar?: File | null;
}

export interface SignUpRequestBody {
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar?: File | null;
}

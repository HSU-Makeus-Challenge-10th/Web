export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
  };
}

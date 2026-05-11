import type { ApiResponse } from '../lp';

export interface User {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

export type UserResponse = ApiResponse<User>;

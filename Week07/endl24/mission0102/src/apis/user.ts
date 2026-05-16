import { axiosInstance } from "./axios";

export interface UpdateProfileRequest {
  name: string;
  bio?: string | null;
  avatar?: string | null;
}

export const updateProfile = async (data: UpdateProfileRequest) => {
  const response = await axiosInstance.patch("/v1/users", data);
  return response.data;
};
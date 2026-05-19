import axiosInstance from './axios';

interface UploadResponse {
  data: {
    imageUrl: string;
  };
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosInstance.post<UploadResponse>('/v1/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data.imageUrl;
};

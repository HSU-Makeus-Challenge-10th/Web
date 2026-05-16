import { PrivateAPI } from './axios';

interface UploadImageResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    imageUrl: string;
  };
}

//이미지 업로드
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await PrivateAPI.post<UploadImageResponse>(
    '/uploads',
    formData
  );

  return data.data.imageUrl;
};

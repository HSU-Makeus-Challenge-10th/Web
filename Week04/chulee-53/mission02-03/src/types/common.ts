export type CommonResponse<T> = {
  status: number;
  statusCode: number;
  message: string;
  data: T;
};

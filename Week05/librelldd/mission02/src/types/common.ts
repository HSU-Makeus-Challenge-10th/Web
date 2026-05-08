

export type CommonResponse<T> = {
    status: boolean;
    message: string;
    statusCode: number;
    data: T;
};
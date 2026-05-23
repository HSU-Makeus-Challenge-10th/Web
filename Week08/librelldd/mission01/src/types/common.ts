import { PAGINATION_ORDER } from "../enums/common";

export type CommonResponse<T> = {
    status: boolean;
    message: string;
    statusCode: number;
    data: T;

};

export type CursorBasedResponse<T> = CommonResponse<{
    data: T
    nextCursor: number | null;
    hasNext: boolean;
}>;

export type PaginationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER;

}
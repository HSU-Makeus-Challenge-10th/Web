export interface CommonResponse<T> {
  status: number;
  message: string;
  data: T;
}

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  cursor?: number;
  limit?: number;
  order?: SortOrder;
  search?: string;
}

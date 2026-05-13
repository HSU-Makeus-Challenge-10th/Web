export interface Author {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Like {
  id: number;
  userId: number;
  lpId: number;
}

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Like[];
  author?: Author;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type LpDetailResponse = ApiResponse<Lp>;

export interface LpPaginationData {
  data: Lp[];
  nextCursor: number;
  hasNext: boolean;
}

export type LpListResponse = ApiResponse<LpPaginationData>;

export interface GetLpsParams {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: 'asc' | 'desc';
}

export interface CreateLpRequest {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export interface UpdateLpRequest {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
}

export interface LikeResponse {
  id: number;
  userId: number;
  lpId: number;
}

export type LikeApiResponse = ApiResponse<LikeResponse>;

export type CreateLpResponse = ApiResponse<Lp>;

export type UpdateLpResponse = ApiResponse<Lp>;

export type DeleteLpResponse = ApiResponse<null>;

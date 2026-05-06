import type { CommonResponse } from './common';

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    name: string;
  };
  likes?: { userId: number }[];
  tags?: { id: number; name: string }[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface LpListData {
  data: Lp[];
  nextCursor: number | null;
  hasNext: boolean;
}

export type LpListResponse = CommonResponse<LpListData>;
export type LpDetailResponse = CommonResponse<Lp>;

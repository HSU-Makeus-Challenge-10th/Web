import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  authorName: any;
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];
  author: {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
  };
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type ResponseLpDto = {
  data: Lp;
};

export type RequestLpDto = {
  lpId?: number;
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
};

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

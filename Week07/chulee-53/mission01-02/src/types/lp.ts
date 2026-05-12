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

export type Author = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
  likes: Likes[];
};

export type ResponseLp = CommonResponse<Lp>;

export type ResponseLpList = CursorBasedResponse<Lp[]>;

export type ResponseLikeLpDto = CommonResponse<{
  id:number;
  userId:number;
  lpId:number;
}>;

export type RequestCreateLp = {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
};
export type Author = {
  id: number;
  name: string;
  email?: string;
  avatar: string | null;
};

export type Comment = {
  id: number;
  lpId: number;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: Author; 
};

export type ResponseCommentsDto = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Comment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
};

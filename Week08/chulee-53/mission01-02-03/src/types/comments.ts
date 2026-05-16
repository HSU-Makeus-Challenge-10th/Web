import type { CursorBasedResponse } from "./common";
import type { Author } from "./lp";

export type Comment = {
    id: number;
    lpId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: Author;
}

export type ResponseCommentList = CursorBasedResponse<Comment[]>
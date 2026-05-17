export type SortOrder = 'asc' | 'desc'

export interface Tag {
  id: number
  name: string
}

export interface Like {
  id: number
  userId: number
  lpId: number
}

export interface Lp {
  id: number
  title: string
  content: string
  thumbnail: string | null
  published: boolean
  authorId: number
  createdAt: string
  updatedAt: string
  tags: Tag[]
  likes: Like[]
}

export interface Author {
  id: number
  name: string
  email: string
  bio: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export interface LpDetail extends Lp {
  author: Author
}

export interface LpListData {
  data: Lp[]
  nextCursor: number
  hasNext: boolean
}

export interface CommentAuthor {
  id: number
  name: string
  email: string
  bio: string | null
  avatar: string | null
}

export interface Comment {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  authorId: number
  lpId: number
  author: CommentAuthor
}

import { posts } from "../backend/src/database/schema";
import type { FeedBook } from "./books";

export type Post = typeof posts.$inferSelect;

export type PostInsert = {
  content: string;
  book?: {
    bookId: number | null;
    googleBookId: string;
    title: string;
    authors?: string[];
    description?: string;
    coverImageUrl?: string;
  };
};

export type EditablePost = Partial<Pick<Post, "content" | "bookId">>;

export type FeedPost = {
  id: number;
  content: string;
  createdAt: Date;
  book: FeedBook | null;
  author: {
    id: number;
    username: string;
    name: string;
    profilePicture: string | null;
  };
  metrics: {
    likeCount: number;
    commentCount: number;
  };
  context: {
    isLikedByMe: boolean;
    isMine: boolean;
    isFollowed: boolean;
  };
};

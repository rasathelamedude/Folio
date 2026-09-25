import { books } from "../backend/src/database/schema";
import type { ApiResponse } from "./api";

export type LocalBook = typeof books.$inferSelect;
export type LocalBookInsert = typeof books.$inferInsert;

export type TrendingBook = {
  title: string;
  authors: string[] | null;
  coverImageUrl: string | null;
  postCount: number;
};

export type ReadListBook = {
  id: number;
  googleBookId: string;
  title: string;
  authors?: string[];
  description?: string;
  coverImageUrl?: string;
  addedAt: string;
};

export interface PostBook {
  bookId: number | null;
  googleBookId: string;
  title: string;
  authors?: string[];
  description?: string;
  coverImageUrl?: string;
}

export type FeedBook = {
  bookId: number;
  googleBookId: string;
  title: string;
  authors: string[] | null;
  description: string | null;
  coverImageUrl: string | null;
};

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    publishedDate?: string;
    pageCount?: number;
  };
}

export interface AddReadListPayload {
  googleBookId: string;
  title: string;
  authors?: string[];
  description?: string;
  coverImageURL?: string;
}

export interface SharePostPayload {
  content: string;
  book?: PostBook;
}

export interface GoogleBooksApiResponse {
  items?: GoogleBook[];
  totalItems: number;
}

export type GetUserReadListApiResponse = ApiResponse<{
  readList: ReadListBook[];
}>;
export type AddToReadListApiResponse = ApiResponse<{ book: LocalBook }>;

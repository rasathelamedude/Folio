import { books } from "../backend/src/database/schema";

export type LocalBook = typeof books.$inferSelect;
export type LocalBookInsert = typeof books.$inferInsert;

export type TrendingBook = {
  title: string;
  authors: string[] | null;
  coverImageUrl: string | null;
  postCount: number;
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

export interface GoogleBooksApiResponse {
  items?: GoogleBook[];
  totalItems: number;
}

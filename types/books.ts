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

export interface GoogleBookVolume {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;

  volumeInfo: {
    title: string;
    subtitle?: string;
    authors: string[];
    publisher?: string;
    publishedDate: string;
    description: string;

    industryIdentifiers: {
      type: string;
      identifier: string;
    }[];

    readingModes: {
      text: boolean;
      image: boolean;
    };

    pageCount: number;
    printType: string;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;

    panelizationSummary?: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };

    imageLinks?: {
      smallThumbnail: string;
      thumbnail: string;
    };

    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };

  saleInfo: {
    country: string;
    saleability: string;
    isEbook: boolean;
  };

  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;

    epub: {
      isAvailable: boolean;
      acsTokenLink?: string;
    };

    pdf: {
      isAvailable: boolean;
    };

    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };

  searchInfo?: {
    textSnippet: string;
  };
}

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

export interface SharePostPayload {
  content: string;
  book?: PostBook;
}

export interface GoogleBooksApiResponse {
  items?: GoogleBookVolume[];
  totalItems: number;
}

export type GetUserReadListApiResponse = ApiResponse<{
  readList: ReadListBook[];
}>;
export type AddToReadListApiResponse = ApiResponse<{ book: LocalBook }>;

import type { GoogleBook, GoogleBookVolume } from "~/types/books";

export function simplifyGoogleBook(book: GoogleBookVolume): GoogleBook {
  return {
    id: book.id,
    volumeInfo: {
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      categories: book.volumeInfo.categories,
      description: book.volumeInfo.description,
      imageLinks: book.volumeInfo.imageLinks,
      pageCount: book.volumeInfo.pageCount,
      publishedDate: book.volumeInfo.publishedDate,
    },
  };
}

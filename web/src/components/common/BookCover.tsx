import { HiOutlineBookOpen } from "react-icons/hi2";
import type { PostBook } from "~/types/books";

const BookCover = ({ book }: { book: PostBook }) => {
  return (
    <span className="flex h-16 w-11 shrink-0 items-center justify-center overflow-hidden rounded bg-secondary text-primary">
      {book.coverImageUrl ? (
        <img
          src={book.coverImageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <HiOutlineBookOpen className="h-5 w-5" />
      )}
    </span>
  );
};

export default BookCover;

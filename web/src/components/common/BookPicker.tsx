import { getBookByName } from "@/api/contentApi";
import { useQuery } from "@tanstack/react-query";
import { useState, useId, useEffect } from "react";
import {
  HiOutlineBookOpen,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";
import type { GoogleBookVolume } from "~/types/books";

interface BookPickerProps {
  selectedBook: GoogleBookVolume | null;
  onSelect: (book: GoogleBookVolume | null) => void;
  disabled?: boolean;
}

const BookPicker = ({
  selectedBook,
  onSelect,
  disabled = false,
}: BookPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchId = useId();

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      350,
    );
    return () => window.clearTimeout(timer);
  }, [search]);

  const ready =
    isOpen &&
    !selectedBook &&
    !disabled &&
    debouncedSearch.length >= 2 &&
    search.trim() === debouncedSearch;

  const {
    data: books,
    refetch,
    isSuccess,
    isFetching,
    isError,
  } = useQuery({
    queryFn: async () => {
      const response = await getBookByName(debouncedSearch);

      return response.books;
    },
    queryKey: ["post-book-search", debouncedSearch],
    enabled: ready,
    staleTime: 60_000,
    retry: 1,
  });

  const selectBook = (book: GoogleBookVolume) => {
    onSelect(book);
    setIsOpen(false);
    setSearch("");
  };

  if (selectedBook) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-secondary bg-secondary/30 p-3">
        {selectedBook.volumeInfo.imageLinks?.thumbnail ||
        selectedBook.volumeInfo.imageLinks?.smallThumbnail ? (
          <img
            src={selectedBook.volumeInfo.imageLinks?.thumbnail}
            alt=""
            className="h-16 w-11 rounded object-cover"
          />
        ) : (
          <HiOutlineBookOpen className="h-10 w-10 shrink-0 text-primary" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
            About this book
          </p>
          <p className="truncate font-serif text-base text-foreground">
            {selectedBook.volumeInfo.title}
          </p>
          <p className="truncate text-xs text-foreground/75">
            {selectedBook.volumeInfo.authors?.join(", ") || "Unknown author"}
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          aria-label="Remove book"
          onClick={() => onSelect(null)}
          className="rounded-full p-2 text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs font-medium text-primary hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
      >
        <HiOutlineBookOpen className="h-4 w-4" />
        {isOpen ? "Close book search" : "Add book"}
      </button>
      {isOpen && (
        <div className="mt-3 rounded-xl border border-secondary p-3">
          <label
            htmlFor={searchId}
            className="mb-2 block text-xs font-medium text-foreground"
          >
            Search by title or author
          </label>
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-foreground/60" />
            <input
              id={searchId}
              type="search"
              disabled={disabled}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              placeholder="Find a book…"
              className="w-full rounded-lg border border-secondary bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div aria-live="polite" className="mt-3 text-xs text-foreground/75">
            {search.trim().length < 2
              ? "Type at least 2 characters."
              : !ready || isFetching
                ? "Searching books…"
                : null}
            {ready && isError && (
              <p>
                Couldn't load books.{" "}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => void refetch()}
                  className="underline"
                >
                  Try again
                </button>
              </p>
            )}
            {ready && isSuccess && books.length === 0 && (
              <p>No books found. Try another title or author.</p>
            )}
          </div>
          {ready && isSuccess && (
            <ul className="mt-2 max-h-60 overflow-y-auto">
              {books.map((book) => (
                <li key={book.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => selectBook(book)}
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {book.volumeInfo.imageLinks?.thumbnail ||
                    book.volumeInfo.imageLinks?.smallThumbnail ? (
                      <img
                        src={
                          book.volumeInfo.imageLinks.thumbnail ||
                          book.volumeInfo.imageLinks.smallThumbnail
                        }
                        alt=""
                        className="h-14 w-10 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <HiOutlineBookOpen className="h-14 w-10 shrink-0 text-primary" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {book.volumeInfo.title}
                      </span>
                      <span className="block truncate text-xs text-foreground/75">
                        {book.volumeInfo.authors?.join(", ") ||
                          "Unknown author"}
                      </span>
                    </span>
                    <span className="text-xs text-primary">Select</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BookPicker;

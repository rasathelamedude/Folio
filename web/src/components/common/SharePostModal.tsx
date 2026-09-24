import { useEffect, useId, useRef, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlineBookOpen,
  HiOutlineMagnifyingGlass,
  HiOutlinePaperAirplane,
  HiOutlineXMark,
} from "react-icons/hi2";
import { ImSpinner } from "react-icons/im";
import { getBookByName, sharePost } from "../../api/contentApi";
import { notifyError, notifySuccess } from "../../lib/toast";
import { useUserStore } from "../../store/userStore";
import type { GoogleBook, PostBook } from "~/types/books";
import type { PostInsert } from "~/types/posts";
import BookCover from "./BookCover";

interface SharePostModalProps {
  setIsSharingPost: Dispatch<SetStateAction<boolean>>;
}

// Convert a Google Books result to the book shape expected by sharePost.
function fromGoogle(book: GoogleBook): PostBook {
  const result: PostBook = {
    bookId: null,
    googleBookId: book.id,
    title: book.volumeInfo.title,
  };

  if (book.volumeInfo.authors) result.authors = book.volumeInfo.authors;
  if (book.volumeInfo.description)
    result.description = book.volumeInfo.description;

  const cover =
    book.volumeInfo.imageLinks?.thumbnail ??
    book.volumeInfo.imageLinks?.smallThumbnail;
  if (cover) result.coverImageUrl = cover.replace(/^http:/, "https:");

  return result;
}

// Keep one result per Google Books ID.
function uniqueBooks(books: PostBook[]): PostBook[] {
  const seen = new Set<string>();

  return books.filter((book) => {
    if (seen.has(book.googleBookId)) return false;
    seen.add(book.googleBookId);
    return true;
  });
}

const SharePostModal = ({ setIsSharingPost }: SharePostModalProps) => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const contentId = useId();
  const searchId = useId();
  const [content, setContent] = useState("");
  const [selectedBook, setSelectedBook] = useState<PostBook | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      350,
    );
    return () => window.clearTimeout(timer);
  }, [search]);

  const ready =
    pickerOpen &&
    search.trim() === debouncedSearch &&
    debouncedSearch.length >= 2;

  const {
    data: books = [],
    isFetching,
    isError: isBookSearchError,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["post-book-search", debouncedSearch],
    queryFn: async () => {
      const response = await getBookByName(debouncedSearch);
      return uniqueBooks((response.books ?? []).map(fromGoogle));
    },
    enabled: ready,
    staleTime: 60_000,
    retry: 1,
  });

  const {
    mutate: share,
    isPending: isSharing,
    isError: isSharingError,
  } = useMutation({
    mutationFn: sharePost,
    onSuccess: async () => {
      notifySuccess("Post shared successfully");
      await queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
      setIsSharingPost(false);
    },
    onError: () => notifyError("Something went wrong when sharing post"),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (isSharing || !trimmedContent || !user) return;

    const payload: PostInsert = {
      content: trimmedContent,
    };

    if (selectedBook !== null) {
      payload.book = selectedBook;
    }

    share(payload);
  };

  const requestClose = () => {
    if (!isSharing) setIsSharingPost(false);
  };

  const selectBook = (book: PostBook) => {
    setSelectedBook(book);
    setPickerOpen(false);
    setSearch("");
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-secondary bg-background p-0 text-foreground shadow-2xl backdrop:bg-foreground/50 backdrop:backdrop-blur-sm"
    >
      <header className="flex items-start justify-between border-b border-secondary px-6 py-5">
        <div>
          <h2 id={titleId} className="font-serif text-2xl text-primary">
            Share a thought
          </h2>
          <p className="mt-1 text-sm text-foreground/75">
            A thought, a quote, or something worth discussing.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close composer"
          disabled={isSharing}
          onClick={requestClose}
          className="rounded-full p-2 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </header>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isSharing} className="min-w-0 space-y-5 p-6">
          <div>
            <label
              htmlFor={contentId}
              className="mb-2 block text-xs font-medium"
            >
              Your post
            </label>
            <textarea
              id={contentId}
              autoFocus
              required
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={5}
              placeholder="What has stayed with you lately?"
              className="w-full resize-y rounded-xl border border-secondary bg-background p-4 text-sm leading-relaxed placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {selectedBook ? (
            <div className="flex items-center gap-3 rounded-xl border border-secondary bg-secondary/50 p-3">
              <BookCover book={selectedBook} />
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                  About this book
                </p>
                <p className="truncate text-sm font-semibold">
                  {selectedBook.title}
                </p>
                <p className="truncate text-xs text-foreground/75">
                  {selectedBook.authors?.join(", ") || "Unknown author"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Remove attached book"
                onClick={() => setSelectedBook(null)}
                className="rounded-full p-2 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-expanded={pickerOpen}
              onClick={() => setPickerOpen(!pickerOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary"
            >
              <HiOutlineBookOpen className="h-5 w-5 text-accent" />
              {pickerOpen ? "Hide book search" : "Add a book"}
              <span className="text-xs font-normal text-foreground/75">
                Optional
              </span>
            </button>
          )}

          {pickerOpen && !selectedBook && (
            <section
              className="rounded-xl border border-secondary p-3"
              aria-label="Find a book"
            >
              <label
                htmlFor={searchId}
                className="mb-2 block text-xs font-medium"
              >
                Search by title or author
              </label>
              <div className="relative">
                <HiOutlineMagnifyingGlass
                  aria-hidden="true"
                  className="absolute left-3 top-3 h-4 w-4 text-foreground/75"
                />
                <input
                  id={searchId}
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.preventDefault();
                  }}
                  placeholder="Find the book you're writing about"
                  className="w-full rounded-lg border border-secondary bg-secondary/50 py-2.5 pl-9 pr-3 text-sm placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div
                aria-live="polite"
                className="mt-3 text-xs text-foreground/75"
              >
                {search.trim().length < 2
                  ? "Type at least 2 characters to find a book."
                  : !ready || isFetching
                    ? "Searching books…"
                    : null}
                {ready && isBookSearchError && (
                  <p role="alert">
                    Couldn't search books.{" "}
                    <button
                      type="button"
                      onClick={() => void refetch()}
                      className="underline"
                    >
                      Try again
                    </button>
                  </p>
                )}
              </div>
              {ready && isSuccess && (
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {books.length === 0 ? (
                    <p role="status" className="p-3 text-xs text-foreground/75">
                      No books found. Try another title or author.
                    </p>
                  ) : (
                    <ul>
                      {books.map((book) => (
                        <li key={book.googleBookId}>
                          <button
                            type="button"
                            onClick={() => selectBook(book)}
                            className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <BookCover book={book} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold">
                                {book.title}
                              </span>
                              <span className="block truncate text-xs text-foreground/75">
                                {book.authors?.join(", ") || "Unknown author"}
                              </span>
                            </span>
                            <span className="text-xs font-medium text-primary">
                              Select
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          )}
          {isSharingError && (
            <p role="alert" className="text-sm text-red-600">
              Your post wasn't shared. Your draft is still here; please try
              again.
            </p>
          )}
          {!user && (
            <p role="alert" className="text-sm text-red-600">
              Please sign in to share a post.
            </p>
          )}
        </fieldset>

        <footer className="flex items-center justify-between gap-4 border-t border-secondary px-6 py-4">
          <p className="text-xs text-foreground/75">
            A book is optional. Your words are enough.
          </p>
          <button
            type="submit"
            disabled={!content.trim() || isSharing || !user}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSharing ? (
              <ImSpinner className="h-4 w-4 animate-spin" />
            ) : (
              <HiOutlinePaperAirplane className="h-4 w-4" />
            )}
            {isSharing ? "Sharing…" : "Share post"}
          </button>
        </footer>
      </form>
    </dialog>
  );
};

export default SharePostModal;

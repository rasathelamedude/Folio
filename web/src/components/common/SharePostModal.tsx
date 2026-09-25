import { useEffect, useId, useRef, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlinePaperAirplane, HiOutlineXMark } from "react-icons/hi2";
import { ImSpinner } from "react-icons/im";
import { sharePost } from "../../api/contentApi";
import { notifyError, notifySuccess } from "../../lib/toast";
import { useUserStore } from "../../store/userStore";
import type { PostBook } from "~/types/books";
import type { PostInsert } from "~/types/posts";
import BookPicker from "./BookPicker";

interface SharePostModalProps {
  setIsSharingPost: Dispatch<SetStateAction<boolean>>;
}

const SharePostModal = ({ setIsSharingPost }: SharePostModalProps) => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const contentId = useId();
  const [content, setContent] = useState("");
  const [selectedBook, setSelectedBook] = useState<PostBook | null>(null);

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
          <BookPicker
            selectedBook={selectedBook}
            onSelect={setSelectedBook}
            disabled={isSharing}
          />
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

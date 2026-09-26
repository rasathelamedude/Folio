import { getFeed, sharePost } from "@/api/contentApi";
import FeedLoadingSkeleton from "@/components/common/FeedLoadingSkeleton";
import NotLoggedInAlertModal from "@/components/common/NotLoggedInAlertModal";
import { notifyError, notifySuccess } from "@/lib/toast";
import { useUserStore } from "@/store/userStore";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useId, useState, type FormEvent } from "react";
import FollowingFeed from "@/components/feed/FollowingFeed";
import ForYouFeed from "@/components/feed/ForYouFeed";
import type { GoogleBookVolume } from "~/types/books";
import type { PostInsert } from "~/types/posts";
import { ImSpinner } from "react-icons/im";
import BookPicker from "@/components/common/BookPicker";
import { simplifyGoogleBook } from "@/lib/books";

type FeedType = "forYou" | "following";

const HomePage = () => {
  const user = useUserStore((state) => state.user);
  const [feedType, setFeedType] = useState<FeedType>("forYou");
  const [content, setContent] = useState("");
  const [selectedBook, setSelectedBook] = useState<GoogleBookVolume | null>(
    null,
  );
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);
  const contentId = useId();
  const queryClient = useQueryClient();

  const {
    data: feed,
    isLoading: isFeedLoading,
    isError: isFeedError,
    refetch: refetchFeed,
    isFetchNextPageError,
    isRefetchError,
    isFetchingNextPage,
    isFetching: isFetchingFeed,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed", "infinite"],
    queryFn: ({ pageParam }) => getFeed(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const seen = new Set<number>();
  const posts = (feed?.pages.flatMap((page) => page.posts) ?? []).filter(
    (post) => {
      if (seen.has(post.id)) return false;
      seen.add(post.id);
      return true;
    },
  );

  const followingPosts = posts.filter((post) => post.context.isFollowed);
  const hasMoreFollowing =
    !!hasNextPage && !posts.some((post) => !post.context.isFollowed);
  const activeFeed = user ? feedType : "forYou";
  const hasMore = activeFeed === "following" ? hasMoreFollowing : hasNextPage;

  const {
    mutate: share,
    isPending: isSharingPost,
    isError: isShareError,
  } = useMutation({
    mutationFn: sharePost,
    onSuccess: async () => {
      setContent("");
      setSelectedBook(null);
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
      await queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["trending-books"] });
      notifySuccess("Post shared successfully");
    },
    onError: () => notifyError("Something went wrong when sharing post"),
  });

  const handleChangeFeedType = (type: FeedType) => {
    if (type === "following" && !user) {
      setIsNotLoggedIn(true);
      return;
    }
    setFeedType(type);
  };

  const handleSharePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setIsNotLoggedIn(true);
      return;
    }

    if (isSharingPost || !content.trim()) return;

    const payload: PostInsert = { content: content.trim() };

    if (selectedBook) payload.book = simplifyGoogleBook(selectedBook);

    share(payload);
  };

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="px-5 pt-7 sm:px-7">
        <h1 className="font-serif text-2xl text-primary">Your Shelf Feed</h1>
        <nav
          aria-label="Feed selection"
          className="mt-4 flex border-b border-secondary"
        >
          <button
            type="button"
            aria-pressed={activeFeed === "forYou"}
            onClick={() => handleChangeFeedType("forYou")}
            className={`border-b-2 px-5 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeFeed === "forYou" ? "border-primary font-medium text-primary" : "border-transparent text-foreground/65 hover:text-primary"}`}
          >
            For you
          </button>
          <button
            type="button"
            aria-pressed={activeFeed === "following"}
            onClick={() => handleChangeFeedType("following")}
            className={`border-b-2 px-5 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeFeed === "following" ? "border-primary font-medium text-primary" : "border-transparent text-foreground/65 hover:text-primary"}`}
          >
            Following
          </button>
        </nav>
      </header>

      <form
        onSubmit={handleSharePost}
        className="border-b border-secondary px-5 py-5 sm:px-7"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-background">
            {user?.name?.trim().charAt(0).toUpperCase() || "F"}
          </span>
          <div className="min-w-0 flex-1">
            <label htmlFor={contentId} className="sr-only">
              Your post
            </label>
            <textarea
              id={contentId}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSharingPost}
              rows={2}
              placeholder="What are you reading? Share a thought…"
              className="w-full resize-y rounded-lg bg-transparent p-1 text-sm leading-6 placeholder:text-foreground/65 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            />
            <div className="mt-3">
              <BookPicker
                selectedBook={selectedBook}
                onSelect={setSelectedBook}
                disabled={isSharingPost}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSharingPost || (!!user && !content.trim())}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-medium text-background hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSharingPost && <ImSpinner className="animate-spin" />}
                {isSharingPost ? "Posting…" : "Post"}
              </button>
            </div>
            {isShareError && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                Couldn't share your post. Your draft is still here.
              </p>
            )}
          </div>
        </div>
      </form>

      <section
        aria-label={activeFeed === "forYou" ? "For you feed" : "Following feed"}
        aria-busy={isFeedLoading}
      >
        {isFeedLoading ? (
          <FeedLoadingSkeleton />
        ) : isFeedError && !feed ? (
          <div role="alert" className="p-8 text-center text-sm">
            <p>Couldn't load your feed.</p>
            <button
              type="button"
              onClick={() => void refetchFeed()}
              className="mt-3 text-primary underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {activeFeed === "forYou" ? (
              <ForYouFeed posts={posts} />
            ) : (
              <FollowingFeed
                posts={followingPosts}
                hasMore={hasMoreFollowing}
              />
            )}

            {isFeedError && (
              <p role="alert" className="px-7 py-3 text-sm text-red-600">
                Couldn't{" "}
                {isFetchNextPageError ? "load more posts" : "refresh posts"}.
                Your loaded posts are still available.
              </p>
            )}

            {isRefetchError && (
              <button
                type="button"
                disabled={isFetchingFeed}
                onClick={() => void refetchFeed()}
                className="m-5 text-sm text-primary underline"
              >
                Retry refresh
              </button>
            )}

            {hasMore ? (
              <div className="flex justify-center p-6">
                <button
                  type="button"
                  disabled={isFetchingFeed}
                  onClick={() => void fetchNextPage()}
                  className="rounded-full bg-secondary px-5 py-2 text-sm text-primary hover:bg-secondary/70 disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? "Loading…"
                    : isFetchNextPageError
                      ? "Try loading more again"
                      : "Load more posts"}
                </button>
              </div>
            ) : (
              posts.length > 0 && (
                <p className="p-6 text-center text-xs text-foreground/60">
                  You're all caught up.
                </p>
              )
            )}
          </>
        )}
      </section>

      {isNotLoggedIn && (
        <NotLoggedInAlertModal setIsNotLoggedIn={setIsNotLoggedIn} />
      )}
    </div>
  );
};

export default HomePage;

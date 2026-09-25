import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import type { FeedPost } from "~/types/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { like, deleteLike } from "@/api/contentApi";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { notifyError } from "@/lib/toast";
import NotLoggedInAlertModal from "../common/NotLoggedInAlertModal";
import PostBook from "./PostBook";

const PostCard = ({ post }: { post: FeedPost }) => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: like,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", "infinite"] });
    },
    onError: () => {
      notifyError("Couldn't like this post. Please try again.");
    },
  });

  const { mutate: removeLikePost, isPending: isRemovingLike } = useMutation({
    mutationFn: deleteLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", "infinite"] });
    },
    onError: () => {
      notifyError("Couldn't remove your like. Please try again.");
    },
  });

  const isUpdatingLike = isLiking || isRemovingLike;
  const isLiked = post.context.isLikedByMe;

  const handleToggleLike = () => {
    if (!user) {
      setIsNotLoggedIn(true);
      return;
    }

    if (isUpdatingLike) return;

    if (isLiked) {
      removeLikePost({ postId: post.id });
    } else {
      likePost({ postId: post.id });
    }
  };

  const date =
    post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);
  const validDate = !Number.isNaN(date.getTime());
  const initials = post.author.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <article className="border-b border-secondary px-5 py-6 sm:px-7">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-secondary text-xs font-semibold text-primary">
          {post.author.profilePicture ? (
            <img
              src={post.author.profilePicture}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initials || "R"
          )}
        </div>
        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold text-foreground">
              {post.author.name}
            </span>
            <span className="text-xs text-foreground/65">
              @{post.author.username}
            </span>
            {validDate && (
              <time
                dateTime={date.toISOString()}
                title={date.toLocaleString()}
                className="text-xs text-foreground/65"
              >
                ·{" "}
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
          </header>
          <p className="mt-4 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-foreground">
            {post.content}
          </p>

          {post.book && <PostBook post={post} />}

          <footer className="mt-4 flex items-center gap-5 text-xs text-foreground/70">
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={isUpdatingLike}
              aria-label={isLiked ? "Unlike post" : "Like post"}
              aria-pressed={isLiked}
              aria-busy={isUpdatingLike}
              className={`cursor-pointer group inline-flex items-center gap-2 rounded-full px-2 py-1.5
              transition duration-200 enabled:hover:bg-accent/10 motion-safe:enabled:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none ${isLiked ? "text-accent" : "text-foreground/70"}`}
            >
              <span
                className="relative inline-block h-5 w-5"
                aria-hidden="true"
              >
                <HiOutlineHeart
                  className={`absolute inset-0 h-5 w-5 transition duration-200 motion-reduce:transition-none ${isLiked ? "opacity-0" : "opacity-100"}`}
                />

                <HiHeart
                  className={`absolute inset-0 h-5 w-5 text-accent transition duration-200 motion-reduce:transition-none ${isLiked ? "opacity-100 motion-safe:scale-110" : "opacity-0 motion-safe:scale-75"}`}
                />
              </span>

              <span className="tabular-nums">
                {post.metrics.likeCount} likes
              </span>
            </button>
          </footer>
        </div>
      </div>

      {isNotLoggedIn && (
        <NotLoggedInAlertModal setIsNotLoggedIn={setIsNotLoggedIn} />
      )}
    </article>
  );
};

export default PostCard;

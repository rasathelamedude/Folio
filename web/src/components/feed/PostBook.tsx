import { HiOutlineBookOpen } from "react-icons/hi2";
import type { FeedPost } from "~/types/posts";

const PostBook = ({ post }: { post: FeedPost }) => {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border border-secondary bg-secondary/20 p-3">
      {/* Cover */}
      <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary">
        {post.book!.coverImageUrl ? (
          <img
            src={post.book!.coverImageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <HiOutlineBookOpen
            aria-hidden="true"
            className="h-6 w-6 text-primary/70"
          />
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
          About this book
        </p>

        <h3 className="font-serif text-base leading-snug text-primary">
          {post.book!.title}
        </h3>

        <p className="mt-1 text-xs text-foreground/70">
          {post.book!.authors?.length
            ? post.book!.authors.join(", ")
            : "Unknown author"}
        </p>
      </div>
    </div>
  );
};

export default PostBook;

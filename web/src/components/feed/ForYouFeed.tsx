import type { FeedPost } from "~/types/posts";
import PostCard from "./PostCard";

const ForYouFeed = ({ posts }: { posts: FeedPost[] }) => {
  if (posts.length === 0) {
    return (
      <p className="px-7 py-12 text-center text-sm text-foreground/75">
        Your shelf is quiet. Share the first thought.
      </p>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ForYouFeed;

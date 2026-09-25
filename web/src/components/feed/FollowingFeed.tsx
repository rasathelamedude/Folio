import type { FeedPost } from "~/types/posts";
import PostCard from "./PostCard";

interface FollowingFeedProps {
  posts: FeedPost[];
  hasMore: boolean;
}

const FollowingFeed = ({ posts, hasMore }: FollowingFeedProps) => {
  if (posts.length === 0) {
    return (
      <p className="px-7 py-12 text-center text-sm text-foreground/75">
        {hasMore
          ? "No posts from followed readers in these results yet."
          : "No posts from followed readers yet. Follow readers to see their thoughts here."}
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

export default FollowingFeed;

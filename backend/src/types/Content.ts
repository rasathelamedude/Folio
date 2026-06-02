import { posts, comments, likes, follows, books } from "../database/schema";

export type Post = typeof posts.$inferSelect;
export type PostInsert = Omit<typeof posts.$inferInsert, "userId">;

export type Comment = typeof comments.$inferSelect;
export type CommentInsert = typeof comments.$inferInsert;

export type Like = typeof likes.$inferSelect;
export type LikeInsert = typeof likes.$inferInsert;

export type Follow = typeof follows.$inferSelect;
export type FollowInsert = typeof follows.$inferInsert;

export type FeedPost = {
  id: number;
  content: string;
  createdAt: Date;
  bookId: number | null;
  author: {
    id: number;
    username: string;
    name: string;
    profilePicture: string | null;
  };
  metrics: {
    likeCount: number;
    commentCount: number;
  };
  context: {
    isLikedByMe: boolean;
    isMine: boolean;
    isFollowed: boolean;
  };
};

export type LocalBook = typeof books.$inferSelect;
export type LocalBookInsert = typeof books.$inferInsert;

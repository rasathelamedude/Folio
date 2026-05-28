import { posts, comments, likes } from "../database/schema";

export type Post = typeof posts.$inferSelect;
export type PostInsert = Omit<typeof posts.$inferInsert, "userId">;

export type Comment = typeof comments.$inferSelect;
export type CommentInsert = typeof comments.$inferInsert;

export type Like = typeof likes.$inferSelect;
export type LikeInsert = typeof likes.$inferInsert;

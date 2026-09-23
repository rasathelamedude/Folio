import { comments } from "../backend/src/database/schema";

export type Comment = typeof comments.$inferSelect;

export type CommentInsert = typeof comments.$inferInsert;

export type PostComments = {
  id: number;
  content: string;
  createdAt: Date;
  postId: number;
  user: {
    id: number;
    username: string;
    name: string;
    profilePicture: string | null;
  };
};

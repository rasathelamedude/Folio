import { posts } from "../database/schema";

export type Post = typeof posts.$inferSelect;
export type PostInsert = typeof posts.$inferInsert;

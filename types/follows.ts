import { follows } from "../backend/src/database/schema";

export type Follow = typeof follows.$inferSelect;
export type FollowInsert = typeof follows.$inferInsert;

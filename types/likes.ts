import { likes } from "../backend/src/database/schema";

export type Like = typeof likes.$inferSelect;
export type LikeInsert = typeof likes.$inferInsert;

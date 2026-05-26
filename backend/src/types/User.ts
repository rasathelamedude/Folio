import { users } from "../database/schema";

export type UserInsert = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProfile = Omit<User, "password" | "createdAt">;
export type UserLogin = Pick<User, "email" | "password">;

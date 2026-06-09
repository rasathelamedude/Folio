import { users } from "../database/schema";

export type UserInsert = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProfile = Omit<
  User,
  "password" | "createdAt" | "googleId" | "isProfileComplete"
>;
export type UserLogin = Pick<User, "email" | "password">;
export type UserAccountUpdate = Partial<
  Pick<User, "name" | "username" | "profilePicture" | "email">
>;
export type UserOAuthSignup = Pick<
  User,
  "email" | "name" | "googleId" | "profilePicture"
>;

export type SimpleUser = Pick<
  User,
  "id" | "name" | "username" | "profilePicture"
>;

export type Follower = SimpleUser;
export type Following = SimpleUser;

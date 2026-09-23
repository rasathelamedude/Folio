import { users } from "../backend/src/database/schema";
import { ApiResponse } from "./api";

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export type SimpleUser = Pick<
  User,
  "id" | "name" | "username" | "profilePicture"
>;

export type UserProfile = Omit<
  User,
  "password" | "createdAt" | "googleId" | "isProfileComplete"
>;

export type UserAccountUpdate = Partial<
  Pick<User, "name" | "username" | "profilePicture" | "email">
>;
export type UserOAuthSignup = Pick<
  User,
  "email" | "name" | "googleId" | "profilePicture"
>;

export type Follower = SimpleUser;
export type Following = SimpleUser;

export type UserSignupData = Pick<
  User,
  "email" | "password" | "name" | "username" | "profilePicture"
>;

export type UserLoginData = Pick<User, "email" | "password">;

export type GetUserProfileApiResponse = ApiResponse<UserProfile>;

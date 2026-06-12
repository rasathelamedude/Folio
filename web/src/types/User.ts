export interface User {
  username: string;
  name: string;
  profilePicture: string | null;
  email: string;
  id: number;
  password?: string | null;
  googleId?: string | null;
  isProfileComplete: boolean;
  createdAt: Date;
}

export type UserSignupData = Pick<
  User,
  "email" | "password" | "name" | "username" | "profilePicture"
>;

export type UserLoginData = Pick<User, "email" | "password">;

type SimpleUser = Pick<User, "id" | "name" | "username" | "profilePicture">;

export type Follower = SimpleUser;
export type Following = SimpleUser;

export type UserAccountUpdate = Partial<
  Pick<User, "name" | "username" | "profilePicture" | "email">
>;

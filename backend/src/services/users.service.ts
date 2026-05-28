import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { users, follows } from "../database/schema";
import {
  UserAccountUpdate,
  User,
  UserProfile,
  Follower,
  Following,
} from "../types/User";

export class UserService {
  private static isUserExists = async (userId: number): Promise<boolean> => {
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    return user.length > 0;
  };

  static async deleteAccount({ userId }: { userId: number }): Promise<void> {
    try {
      const deletedUser = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning()
        .execute();

      if (deletedUser.length === 0) {
        throw new Error("USER_NOT_DELETED");
      }
    } catch (error: any) {
      console.error("Delete account error:", error?.message ?? error);
      throw error;
    }
  }

  static async updateAccount(
    userId: number,
    data: UserAccountUpdate,
  ): Promise<User> {
    try {
      if (data.username) {
        const existingUsername = await db
          .select()
          .from(users)
          .where(eq(users.username, data.username))
          .execute();

        if (existingUsername.length > 0 && existingUsername[0].id !== userId) {
          throw new Error("USERNAME_IN_USE");
        }
      }

      if (data.email) {
        const existingEmail = await db
          .select()
          .from(users)
          .where(eq(users.email, data.email))
          .execute();

        if (existingEmail.length > 0 && existingEmail[0].id !== userId) {
          throw new Error("EMAIL_IN_USE");
        }
      }

      const updatedUsers = await db
        .update(users)
        .set(data)
        .where(eq(users.id, userId))
        .returning()
        .execute();

      if (updatedUsers.length === 0) {
        throw new Error("USER_NOT_FOUND");
      }

      return updatedUsers[0] as User;
    } catch (error: any) {
      if (error?.code === "23505") {
        const constraint =
          (error.constraint as string) || (error.message as string);
        if (constraint?.includes("username")) {
          throw new Error("USERNAME_IN_USE");
        }
        if (constraint?.includes("email")) {
          throw new Error("EMAIL_IN_USE");
        }
      }

      console.error("Update account error:", error?.message ?? error);
      throw error;
    }
  }

  static async getUserByUsername(username: string): Promise<UserProfile> {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .execute();

      if (user.length === 0) {
        throw new Error("USER_NOT_FOUND");
      }

      return user[0] as UserProfile;
    } catch (error: any) {
      console.error("Get user by username error: ", error?.message ?? error);
      throw error;
    }
  }

  static async getUserFollowers(userId: number): Promise<Follower[]> {
    try {
      // Check if user exists
      if (!this.isUserExists(userId)) {
        throw new Error("USER_NOT_FOUND");
      }

      const followers = await db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          profilePicture: users.profilePicture,
        })
        .from(follows)
        .innerJoin(users, eq(follows.followerId, users.id))
        .where(eq(follows.followedId, userId))
        .execute();

      return followers as Follower[];
    } catch (error: any) {
      console.error("Get user followers error: ", error?.message ?? error);
      throw error;
    }
  }

  static async getUserFollowings(userId: number): Promise<Following[]> {
    try {
      // Check if user exists
      if (!this.isUserExists(userId)) {
        throw new Error("USER_NOT_FOUND");
      }

      const followings = await db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          profilePicture: users.profilePicture,
        })
        .from(follows)
        .innerJoin(users, eq(follows.followedId, users.id))
        .where(eq(follows.followerId, userId))
        .execute();

      return followings as Following[];
    } catch (error: any) {
      console.error("Get user followings error: ", error?.message ?? error);
      throw error;
    }
  }
}

import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { users } from "../database/schema";
import { UserAccountUpdate, User } from "../types/User";

export class UserService {
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
}

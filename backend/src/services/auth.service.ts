import { users } from "../database/schema";
import { db } from "../database/db";
import { eq } from "drizzle-orm";

type UserInsert = typeof users.$inferInsert;
type User = typeof users.$inferSelect;

export class AuthService {
  static async signup(newUser: UserInsert): Promise<User> {
    try {
      // Hash the password
      newUser.password = await Bun.password.hash(newUser.password!);

      // Insert the new user
      const inserted = await db
        .insert(users)
        .values(newUser)
        .returning()
        .execute();

      if (inserted.length === 0) {
        throw new Error("FAILED_TO_CREATE_USER");
      }

      return inserted[0] as User;
    } catch (error: any) {
      // Handle Postgres unique constraint fallback
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

      console.error(error?.message ?? error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<User> {
    try {
      const usersFound = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .execute();

      if (usersFound.length === 0) {
        throw new Error("USER_NOT_FOUND");
      }

      const user = usersFound[0];

      const isMatch = await Bun.password.verify(password, user.password!);

      if (!isMatch) {
        throw new Error("INVALID_PASSWORD");
      }

      return user as User;
    } catch (error: any) {
      console.error(error?.message ?? error);
      throw error;
    }
  }
}

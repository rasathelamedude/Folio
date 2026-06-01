import { users } from "../database/schema";
import { db } from "../database/db";
import { eq } from "drizzle-orm";
import { User, UserInsert, UserProfile, UserOAuthSignup } from "../types/User";

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

  static async getUserById(userId: number): Promise<UserProfile> {
    try {
      const user: UserProfile[] = await db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          email: users.email,
          googleId: users.googleId,
          profilePicture: users.profilePicture,
          isProfileComplete: users.isProfileComplete,
        })
        .from(users)
        .where(eq(users.id, userId))
        .execute();

      if (user.length === 0) {
        throw new Error("USER_NOT_FOUND");
      }

      return user[0] as UserProfile;
    } catch (error: any) {
      console.error(error?.message ?? error);
      throw error;
    }
  }

  static async findOrCreateGoogleUser({
    email,
    name,
    googleId,
    profilePicture,
  }: UserOAuthSignup): Promise<User> {
    try {
      const user: User[] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .execute();

      if (user.length > 0) {
        const foundUser: User = user[0];

        // Link Google account if not already linked
        if (!foundUser.googleId) {
          const updatedUsers: User[] = await db
            .update(users)
            .set({
              googleId,
              profilePicture: foundUser.profilePicture ?? profilePicture,
            })
            .where(eq(users.id, foundUser.id))
            .returning()
            .execute();

          return updatedUsers[0] as User;
        }

        return foundUser as User;
      }

      // Create a temporary username
      const tempId = crypto.randomUUID().split("-")[0];
      const tempUsername = `folio_${tempId}`;

      const newUser: UserInsert = {
        email,
        name,
        username: tempUsername,
        googleId,
        profilePicture,
        isProfileComplete: false,
      };

      const insertedUsers: User[] = await db
        .insert(users)
        .values(newUser)
        .returning()
        .execute();

      if (insertedUsers.length === 0) {
        throw new Error("FAILED_TO_CREATE_GOOGLE_USER");
      }

      return insertedUsers[0] as User;
    } catch (error: any) {
      console.error(error?.message ?? error);
      throw error;
    }
  }
}

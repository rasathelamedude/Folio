import { AuthService } from "../services/auth.service";
import { users } from "../database/schema";

type UserInsert = typeof users.$inferInsert;
type User = typeof users.$inferSelect;

export class AuthController {
  static async signup({
    body,
    jwt,
  }: {
    body: UserInsert;
    jwt: {
      sign: (payload: object) => Promise<string>;
      verify: (token: string) => Promise<any>;
    };
  }): Promise<Response> {
    try {
      // Create the user
      const createdUser: User = await AuthService.signup(body);

      // Generate JWT token
      const token = await jwt.sign({ userId: createdUser.id });

      // Prepare the response
      const resp = {
        success: true,
        data: {
          user: {
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            profilePicture: createdUser.profilePicture,
          },
          token,
        },
      };

      return new Response(JSON.stringify(resp), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status = 500;
      let message = error?.message ?? "Error occurred while signing up";

      if (message === "USERNAME_IN_USE") {
        status = 409;
        message = "Username already taken";
      } else if (message === "EMAIL_IN_USE") {
        status = 409;
        message = "Email already in use";
      } else if (message === "FAILED_TO_CREATE_USER") {
        status = 500;
        message = "Failed to create user";
      }

      const resp = { success: false, error: message };

      return new Response(JSON.stringify(resp), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}

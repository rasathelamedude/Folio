import { AuthService } from "../services/auth.service";
import { users } from "../database/schema";

type UserInsert = typeof users.$inferInsert;
type User = typeof users.$inferSelect;
type UserLogin = Pick<User, "email" | "password">;

interface JWTService {
  sign: (payload: { userId: number }) => Promise<string>;
  verify: (token: string) => Promise<any>;
}

export class AuthController {
  static async signup({
    body,
    jwt,
  }: {
    body: UserInsert;
    jwt: JWTService;
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

  static async login({
    body,
    jwt,
  }: {
    body: UserLogin;
    jwt: JWTService;
  }): Promise<Response> {
    try {
      const authenticatedUser: User = await AuthService.login(
        body.email,
        body.password!,
      );

      const token = await jwt.sign({ userId: authenticatedUser.id });

      const response = {
        success: true,
        data: {
          user: {
            id: authenticatedUser.id,
            username: authenticatedUser.username,
            email: authenticatedUser.email,
            profilePicture: authenticatedUser.profilePicture,
          },
          token,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status = 500;
      let message = "An error occurred while logging in";

      if (
        error?.message === "USER_NOT_FOUND" ||
        error?.message === "INVALID_PASSWORD"
      ) {
        status = 401;
        message = "Invalid email or password";
      } else {
        console.error("Login error:", error?.message ?? error);
      }

      return new Response(JSON.stringify({ success: false, error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}

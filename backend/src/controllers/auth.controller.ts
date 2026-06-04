import { AuthService } from "../services/auth.service";
import { User, UserInsert, UserProfile, UserLogin } from "../types/User";
import { JWTService } from "../lib/jwt";
import { Cookie } from "elysia";

export class AuthController {
  static async signup({
    body,
    jwt,
    cookie,
  }: {
    body: UserInsert;
    jwt: JWTService;
    cookie: { authToken: Cookie<string | undefined> };
  }): Promise<Response> {
    try {
      // Create the user
      const createdUser: User = await AuthService.signup(body);

      // Generate JWT token
      const token = await jwt.sign({ userId: createdUser.id });

      cookie.authToken.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

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
    cookie,
  }: {
    body: UserLogin;
    jwt: JWTService;
    cookie: { authToken: Cookie<string | undefined> };
  }): Promise<Response> {
    try {
      const authenticatedUser: User = await AuthService.login(
        body.email,
        body.password!,
      );

      const token = await jwt.sign({ userId: authenticatedUser.id });

      cookie.authToken.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      const response = {
        success: true,
        data: {
          user: {
            id: authenticatedUser.id,
            username: authenticatedUser.username,
            email: authenticatedUser.email,
            profilePicture: authenticatedUser.profilePicture,
          },
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
      }

      return new Response(JSON.stringify({ success: false, error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  static async getProfile({ userId }: { userId: number }): Promise<Response> {
    try {
      const user: UserProfile = await AuthService.getUserById(userId);

      const response = {
        success: true,
        data: {
          user,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status = 500;
      let message = "An error occurred while fetching the profile";

      if (error?.message === "USER_NOT_FOUND") {
        status = 404;
        message = "User not found";
      }

      const response = {
        success: false,
        error: message,
      };

      return new Response(JSON.stringify(response), {
        status: status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  static async signInWithGoogle(): Promise<Response> {
    try {
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      return Response.redirect(googleAuthUrl);
    } catch (error: any) {
      console.error("Sign In with Google Error:", error?.message ?? error);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to initiate Google Sign-In",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  static async googleCallback({
    query,
    jwt,
  }: {
    query: { code?: string; error?: string };
    jwt: JWTService;
  }): Promise<Response> {
    try {
      if (query.error) {
        throw new Error(`Google Sign-In Error: ${query.error}`);
      }

      const { code } = query;
      if (!code) {
        throw new Error("Authorization code not found in the callback");
      }

      // Exchange the authorization code for an access token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(tokenData.error_description);

      // Use the access token to fetch user's information
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer: ${tokenData.access_token}` },
        },
      );

      const googleUser = await userResponse.json();

      // Find or create a user in the database based on the Google profile
      const user: User = await AuthService.findOrCreateGoogleUser({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        profilePicture: googleUser.picture,
      });

      const token = await jwt.sign({ userId: user.id });

      // Redirect back to the mobile app with the token
      const mobileAppDeepLink = `folio://login-success?token=${token}`;
      return Response.redirect(mobileAppDeepLink, 302);
    } catch (error: any) {
      console.error("Google Callback Error:", error?.message ?? error);

      return Response.redirect(`folio://login-failure?error=auth_failed`, 302);
    }
  }
}

import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";
import { accessJwtPlugin } from "../lib/accessJwt";
import { refreshJwtPlugin } from "../lib/refreshJwt";
import { authMiddleware } from "../middleware/auth.middleware";
import { Cookie } from "elysia";

enum Client {
  Web = "web",
  Mobile = "mobile",
}

export const authRoutes = new Elysia()
  .use(accessJwtPlugin)
  .use(refreshJwtPlugin)
  .group("/api/v1/auth", (app) =>
    app
      .post(
        "/signup",
        ({ body, accessJwt, refreshJwt, cookie }) =>
          AuthController.signup({
            body,
            accessJwt,
            refreshJwt,
            cookie: cookie as {
              accessToken: Cookie<string | undefined>;
              refreshToken: Cookie<string | undefined>;
            },
          }),
        {
          body: t.Object({
            username: t.String(),
            name: t.String(),
            email: t.String({ format: "email" }),
            password: t.String({ minLength: 6 }),
            profilePicture: t.Optional(t.String()),
          }),
        },
      )
      .post(
        "/login",
        ({ body, accessJwt, refreshJwt, cookie }) =>
          AuthController.login({
            body,
            accessJwt,
            refreshJwt,
            cookie: cookie as {
              accessToken: Cookie<string | undefined>;
              refreshToken: Cookie<string | undefined>;
            },
          }),
        {
          body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String({ minLength: 6 }),
          }),
        },
      )
      .get(
        "/google",
        ({ query }) => AuthController.signInWithGoogle({ query }),
        {
          query: t.Object({
            client: t.Enum(Client),
          }),
        },
      )
      .get(
        "/google/callback",
        ({ query, accessJwt, refreshJwt, cookie }) =>
          AuthController.googleCallback({
            query,
            accessJwt,
            refreshJwt,
            cookie: cookie as {
              accessToken: Cookie<string | undefined>;
              refreshToken: Cookie<string | undefined>;
            },
          }),
        {
          query: t.Object({
            code: t.Optional(t.String() || t.Undefined()),
            error: t.Optional(t.String() || t.Undefined()),
            state: t.Optional(t.Enum(Client) || t.Undefined()),
          }),
        },
      )
      .post("/logout", ({ cookie }) =>
        AuthController.logout({
          cookie: cookie as {
            accessToken: Cookie<string | undefined>;
            refreshToken: Cookie<string | undefined>;
          },
        }),
      )
      .use(authMiddleware)
      .get("/me", ({ userId }: { userId: number }) =>
        AuthController.getProfile({ userId }),
      ),
  );

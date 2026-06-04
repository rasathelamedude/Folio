import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";
import { jwtPlugin } from "../lib/jwt";
import { authMiddleware } from "../middleware/auth.middleware";
import { Cookie } from "elysia";

export const authRoutes = new Elysia()
  .use(jwtPlugin)
  .group("/api/v1/auth", (app) =>
    app
      .post(
        "/signup",
        ({ body, jwt, cookie }) =>
          AuthController.signup({
            body,
            jwt,
            cookie: cookie as {
              authToken: Cookie<string | undefined>;
            },
          }),
        {
          body: t.Object({
            username: t.String(),
            name: t.String(),
            email: t.String({ format: "email" }),
            password: t.String({ minLength: 6 }),
          }),
        },
      )
      .post(
        "/login",
        ({ body, jwt, cookie }) =>
          AuthController.login({
            body,
            jwt,
            cookie: cookie as {
              authToken: Cookie<string | undefined>;
            },
          }),
        {
          body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String({ minLength: 6 }),
          }),
        },
      )
      .get("/google", () => AuthController.signInWithGoogle())
      .get("/google/callback", ({ query, jwt }) =>
        AuthController.googleCallback({ query, jwt }),
      )
      .use(authMiddleware)
      .get("/me", ({ userId }) => AuthController.getProfile({ userId })),
  );

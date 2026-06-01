import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";
import { jwtPlugin } from "../lib/jwt";
import { authMiddleware } from "../middleware/auth.middleware";

export const authRoutes = new Elysia()
  .use(jwtPlugin)
  .group("/api/v1/auth", (app) =>
    app
      .post(
        "/signup",
        ({ body, jwt }) => AuthController.signup({ body, jwt }),
        {
          body: t.Object({
            username: t.String(),
            name: t.String(),
            email: t.String({ format: "email" }),
            password: t.String({ minLength: 6 }),
          }),
        },
      )
      .post("/login", ({ body, jwt }) => AuthController.login({ body, jwt }), {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String({ minLength: 6 }),
        }),
      })
      .get("/google", () => AuthController.signInWithGoogle())
      .get("/google/callback", ({ query, jwt }) =>
        AuthController.googleCallback({ query, jwt }),
      )
      .use(authMiddleware)
      .get("/me", ({ userId }) => AuthController.getProfile({ userId })),
  );

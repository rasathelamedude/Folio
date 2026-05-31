import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";
import { jwtPlugin } from "../lib/jwt";
import { authMiddleware } from "../middleware/auth.middleware";

export const authRoutes = new Elysia()
  .use(jwtPlugin)
  .group("/api/v1/auth", (app) =>
    app
      .post("/signup", (context) => AuthController.signup(context), {
        body: t.Object({
          username: t.String(),
          email: t.String({ format: "email" }),
          password: t.String({ minLength: 6 }),
        }),
      })
      .post("/login", (context) => AuthController.login(context), {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String({ minLength: 6 }),
        }),
      })
      .get("/google", () => AuthController.signInWithGoogle())
      .get("/google/callback", () => "Google Callback")
      .use(authMiddleware)
      .get("/me", ({ userId }) => AuthController.getProfile({ userId })),
  );

import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";
import { jwtPlugin } from "../lib/jwt";

export const authRoutes = new Elysia()
  .use(jwtPlugin)
  .group("/api/v1/auth", (app) =>
    app.post(
      "/signup",
      ({ body, jwt }) => AuthController.signup({ body, jwt }),
      {
        body: t.Object({
          username: t.String(),
          email: t.String({ format: "email" }),
          password: t.String({ minLength: 6 }),
        }),
      },
    ),
  );

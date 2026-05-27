import { Elysia, t } from "elysia";
import { jwtPlugin } from "../lib/jwt";
import { UserController } from "../controllers/users.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRoutes = new Elysia()
  .use(jwtPlugin)
  .group("/api/v1/users", (app) =>
    app
      .use(authMiddleware)
      .delete("/account", async ({ userId }) =>
        UserController.deleteAccount({ userId }),
      )
      .patch(
        "/account",
        async ({ userId, body }) =>
          UserController.updateAccount({ userId, body }),
        {
          body: t.Object(
            {
              name: t.Optional(t.String()),
              username: t.Optional(t.String()),
              profilePicture: t.Optional(t.String({ format: "url" })),
              email: t.Optional(t.String({ format: "email" })),
            },
            {
              minProperties: 1,
            },
          ),
        },
      ),
  );

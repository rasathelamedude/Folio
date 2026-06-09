import { Cookie, Elysia, t } from "elysia";
import { UserController } from "../controllers/users.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRoutes = new Elysia().group("/api/v1/users", (app) =>
  app
    .get(
      "/",
      async ({ query }) => UserController.getUserByUsername(query.username),
      {
        query: t.Object({
          username: t.String(),
        }),
      },
    )
    .get(
      "/:userId/followers",
      async ({ params }) => UserController.getUserFollowers(params.userId),
      {
        params: t.Object({
          userId: t.Numeric(),
        }),
      },
    )
    .get(
      "/:userId/followings",
      async ({ params }) => UserController.getUserFollowings(params.userId),
      {
        params: t.Object({
          userId: t.Numeric(),
        }),
      },
    )
    .use(authMiddleware)
    .delete("/account", async ({ userId, cookie }) =>
      UserController.deleteAccount({
        userId,
        cookie: cookie as {
          accessToken: Cookie<string | undefined>;
          refreshToken: Cookie<string | undefined>;
        },
      }),
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

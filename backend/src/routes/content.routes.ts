import { Elysia, t } from "elysia";
import { jwtPlugin } from "../lib/jwt";
import { ContentController } from "../controllers/content.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const contentRoutes = new Elysia()
  .use(jwtPlugin)
  .group("/api/v1/content", (app) =>
    app
      .use(authMiddleware)
      .get(
        "/users/:userID/posts",
        async ({ params }) =>
          ContentController.getPostsByUserId(parseInt(params.userID)),
        {
          params: t.Object({
            userID: t.String({ pattern: "^[0-9]+$" }),
          }),
        },
      )
  );

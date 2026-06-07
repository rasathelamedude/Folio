import { Elysia } from "elysia";
import { accessJwtPlugin } from "../lib/accessJwt";

export const authMiddleware = (app: Elysia) =>
  app.use(accessJwtPlugin).derive(async ({ cookie, accessJwt, set }) => {
    const token: string | undefined = cookie.accessToken?.value as
      | string
      | undefined;

    if (!token) {
      set.status = 401;
      throw new Error("No token provided");
    }

    const payload = await accessJwt.verify(token);

    if (!payload || payload.userId === undefined) {
      set.status = 401;
      throw new Error("Invalid token");
    }

    return { userId: Number(payload.userId) };
  });

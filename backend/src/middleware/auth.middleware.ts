import { Elysia } from "elysia";
import { jwtPlugin } from "../lib/jwt";

export const authMiddleware = (app: Elysia) =>
  app.use(jwtPlugin).derive(async ({ cookie, jwt, set }) => {
    const token: string | undefined = cookie.authToken?.value as
      | string
      | undefined;

    if (!token) {
      set.status = 401;
      throw new Error("No token provided");
    }

    const payload = await jwt.verify(token);

    if (!payload || payload.userId === undefined) {
      set.status = 401;
      throw new Error("Invalid token");
    }

    return { userId: Number(payload.userId) };
  });

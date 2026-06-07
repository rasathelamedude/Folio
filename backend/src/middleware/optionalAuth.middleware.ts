import { Elysia } from "elysia";
import { accessJwtPlugin } from "../lib/accessJwt";

export const optionalAuthMiddleware = (app: Elysia) =>
  app.use(accessJwtPlugin).derive(async ({ cookie, accessJwt, set }) => {
    const token: string | undefined = cookie.accessToken?.value as
      | string
      | undefined;

    if (!token) return { userId: undefined };

    try {
      const payload = await accessJwt.verify(token);

      if (!payload || payload.userId === undefined) {
        throw new Error("Invalid token");
      }
      return { userId: Number(payload.userId) };
    } catch (error) {
      return { userId: undefined }; // Gracefully degrade to guest mode
    }
  });

import { Elysia } from "elysia";
import { JWTPayload } from "../types/ApiResponse";
import { jwtPlugin } from "../lib/jwt";

export const authMiddleware = (app: Elysia) =>
  app.use(jwtPlugin).derive(async ({ headers, jwt, set }) => {
    const authHeader = headers.authorization;

    if (!authHeader) {
      set.status = 401;
      throw new Error("No authorization header provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      set.status = 401;
      throw new Error("No token provided");
    }

    const payload = (await jwt.verify(token)) as JWTPayload | false;

    if (!payload || payload.userId === undefined) {
      set.status = 401;
      throw new Error("Invalid token");
    }

    return { userId: Number(payload.userId) };
  });

import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export interface JWTService {
  sign: (payload: { userId: number }) => Promise<string>;
  verify: (token: string) => Promise<any>;
}

export const jwtPlugin = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET!,
    exp: "7d",
  }),
);

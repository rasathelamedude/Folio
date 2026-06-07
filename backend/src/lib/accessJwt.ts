import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export interface JWTService {
  sign: (payload: { userId: number }) => Promise<string>;
  verify: (token: string) => Promise<any>;
}

export const accessJwtPlugin = new Elysia().use(
  jwt({
    name: "accessJwt",
    secret: process.env.ACCESS_JWT_SECRET!,
    exp: "30m",
  }),
);

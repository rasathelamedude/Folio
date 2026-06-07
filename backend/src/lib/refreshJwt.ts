import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const refreshJwtPlugin = new Elysia().use(
  jwt({
    name: "refreshJwt",
    secret: process.env.REFRESH_JWT_SECRET!,
    exp: "7d",
  }),
);

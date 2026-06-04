import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/users.routes";
import { contentRoutes } from "./routes/content.routes";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";

export const app = new Elysia()
  .use(cors())
  .use(cookie())
  .use(authRoutes)
  .use(userRoutes)
  .use(contentRoutes);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

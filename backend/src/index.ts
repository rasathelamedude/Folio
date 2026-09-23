import { Elysia } from "elysia";
import { authRoutes } from "@/routes/auth.routes";
import { userRoutes } from "@/routes/users.routes";
import { contentRoutes } from "@/routes/content.routes";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { HealthController } from "@/controllers/health.controller";

export const app = new Elysia()
  .use(cors())
  .use(cookie())
  .use(authRoutes)
  .use(userRoutes)
  .use(contentRoutes);

app.get("/health", () => HealthController.check());

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

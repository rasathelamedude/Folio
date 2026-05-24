import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth.routes";

const app = new Elysia();

app.use(authRoutes);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

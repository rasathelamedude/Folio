import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/users.routes";
import { contentRoutes } from "./routes/content.routes";

const app = new Elysia();

app.use(authRoutes);
app.use(userRoutes);
app.use(contentRoutes);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

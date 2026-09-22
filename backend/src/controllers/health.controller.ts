import { sql } from "drizzle-orm";
import { db } from "../database/db";

export class HealthController {
  static async check() {
    try {
      const dbResult = await db.execute(sql<number>`SELECT 1`);

      if (dbResult.rows.length === 0) {
        throw new Error("Database is not healthy");
      }

      return new Response(
        JSON.stringify({
          status: "ok",
          message: "Backend is healthy",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Backend is not healthy",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }
}

import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { posts } from "../database/schema";
import { Post } from "../types/Post";
import { GoogleBooksApiResponse } from "../types/GoogleBooks";

export class ContentService {
  static async getPostsByUserId(userId: number): Promise<Post[]> {
    try {
      const userPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, userId))
        .execute();

      if (userPosts.length === 0) {
        throw new Error("NO_POSTS_FOUND");
      }

      return userPosts as Post[];
    } catch (error: any) {
      console.error("Get posts by user ID error:", error?.message ?? error);
      throw error;
    }
  }
}

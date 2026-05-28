import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { posts } from "../database/schema";
import { Post, PostInsert } from "../types/Content";
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

  static async getBookByName(
    bookName: string,
  ): Promise<GoogleBooksApiResponse> {
    try {
      const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
      if (!apiKey) {
        throw new Error("MISSING_API_KEY");
      }

      // enocode the book name to be URL safe
      const query = encodeURIComponent(bookName);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`,
      );

      if (!response.ok) {
        throw new Error("GOOGLE_API_ERROR");
      }

      const data = (await response.json()) as GoogleBooksApiResponse;
      return data;
    } catch (error: any) {
      console.error("Search books error:", error?.message ?? error);
      throw error;
    }
  }

  static async getPostById(postId: number): Promise<Post> {
    try {
      const post: Post[] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, postId))
        .execute();

      if (post.length === 0) {
        throw new Error("POST_NOT_FOUND");
      }

      return post[0] as Post;
    } catch (error: any) {
      console.error("Get post by ID error:", error?.message ?? error);
      throw error;
    }
  }

  static async createPost(postData: PostInsert, userId: number): Promise<Post> {
    try {
      const newPost = await db
        .insert(posts)
        .values({ ...postData, userId })
        .returning()
        .execute();

      if (newPost.length === 0) {
        throw new Error("POST_CREATION_FAILED");
      }

      return newPost[0] as Post;
    } catch (error: any) {
      console.error("Create post error:", error?.message ?? error);
      throw error;
    }
  }
}

import { ContentService } from "../services/content.service";
import { Post } from "../types/Post";
import { GoogleBooksApiResponse } from "../types/GoogleBooks";

export class ContentController {
  static async getPostsByUserId(userId: number): Promise<Response> {
    try {
      const userPosts: Post[] = await ContentService.getPostsByUserId(userId);

      const response = {
        success: true,
        data: {
          posts: userPosts,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Get posts by user ID error:", error?.message ?? error);

      let status = 500;
      let message = "An error occurred while fetching user posts";

      if (error?.message === "NO_POSTS_FOUND") {
        status = 404;
        message = "No posts found for this user";
      }

      const response = {
        success: false,
        error: message,
      };

      return new Response(JSON.stringify(response), {
        status: status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  static async getBookByName(bookName: string): Promise<Response> {
    try {
      const books: GoogleBooksApiResponse =
        await ContentService.getBookByName(bookName);

      const response = {
        success: true,
        data: {
          books: books.items || [],
          totalItems: books.totalItems,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Search books error:", error?.message ?? error);

      let status = 500;
      let message = "An error occurred while searching for books";

      if (error?.message === "MISSING_API_KEY") {
        status = 500;
        message = "Google Books API key is not configured";
      } else if (error?.message === "GOOGLE_API_ERROR") {
        status = 502;
        message = "Failed to fetch from Google Books API";
      }

      const response = {
        success: false,
        error: message,
      };

      return new Response(JSON.stringify(response), {
        status: status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}

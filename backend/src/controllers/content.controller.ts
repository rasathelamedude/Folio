import { ContentService } from "../services/content.service";
import { Post, PostInsert } from "../types/Content";
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

  static async getPostById(postId: number): Promise<Response> {
    try {
      const post: Post = await ContentService.getPostById(postId);

      const response = {
        success: true,
        data: {
          post: post,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while fetching the post";

      if (error?.message === "POST_NOT_FOUND") {
        status = 404;
        message = "Post not found";
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

  static async createPost(
    postData: PostInsert,
    userId: number,
  ): Promise<Response> {
    try {
      const newPost: Post = await ContentService.createPost(postData, userId);

      const response = {
        success: true,
        data: {
          post: newPost,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while creating the post";

      if (error?.message === "POST_CREATION_FAILED") {
        message = "Failed to create the post";
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

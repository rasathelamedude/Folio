import { ContentService } from "../services/content.service";
import {
  Post,
  PostInsert,
  Like,
  Comment,
  Follow,
  FeedPost,
  PostComments,
} from "../types/Content";
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

  static async getCommentsForPost(postId: number): Promise<Response> {
    try {
      const comments: PostComments[] =
        await ContentService.getCommentsForPost(postId);

      const response = {
        success: true,
        data: {
          comments,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status = 500;
      let message = "An error occurred while fetching comments";

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

  static async createPost(data: PostInsert, userId: number): Promise<Response> {
    try {
      const newPost: Post = await ContentService.createPost(data, userId);

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

  static async addLike(
    data: { postId?: number; commentId?: number },
    userId: number,
  ): Promise<Response> {
    try {
      const like: Like = await ContentService.addLike(
        userId,
        data.postId,
        data.commentId,
      );

      const response = {
        success: true,
        data: {
          like,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while adding the like";

      if (error?.message === "INVALID_LIKE_INPUT") {
        status = 400;
        message = "Must provide either postId or commentId, but not both";
      } else if (error?.message === "POST_NOT_FOUND") {
        status = 404;
        message = "Post not found";
      } else if (error?.message === "COMMENT_NOT_FOUND") {
        status = 404;
        message = "Comment not found";
      } else if (error?.message === "ALREADY_LIKED") {
        status = 409;
        message = "You have already liked this post or comment";
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

  static async addComment(
    data: { postId: number; content: string },
    userId: number,
  ): Promise<Response> {
    try {
      const comment: Comment = await ContentService.addComment(
        userId,
        data.postId,
        data.content,
      );

      const response = {
        success: true,
        data: {
          comment,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while creating the comment";

      if (error?.message === "POST_NOT_FOUND") {
        status = 404;
        message = "Post not found";
      } else if (error?.message === "COMMENT_CREATION_FAILED") {
        message = "Failed to create the comment";
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

  static async editPost(
    postId: number,
    data: { content?: string; bookId?: number },
    userId: number,
  ): Promise<Response> {
    try {
      const updatedPost: Post = await ContentService.editPost(
        postId,
        userId,
        data,
      );

      const response = {
        success: true,
        data: {
          post: updatedPost,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while editing the post";

      if (error?.message === "POST_NOT_FOUND") {
        status = 404;
        message = "Post not found";
      } else if (error?.message === "UNAUTHORIZED") {
        status = 403;
        message = "You do not have permission to edit this post";
      } else if (error?.message === "POST_UPDATE_FAILED") {
        message = "Failed to update the post";
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

  static async deletePost(postId: number, userId: number): Promise<Response> {
    try {
      await ContentService.deletePost(postId, userId);

      return new Response("", {
        status: 204,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while deleting the post";

      if (error?.message === "POST_NOT_FOUND") {
        status = 404;
        message = "Post not found";
      } else if (error?.message === "UNAUTHORIZED") {
        status = 403;
        message = "You do not have permission to delete this post";
      } else if (error?.message === "POST_DELETE_FAILED") {
        message = "Failed to delete the post";
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

  static async deleteComment(
    commentId: number,
    userId: number,
  ): Promise<Response> {
    try {
      await ContentService.deleteComment(commentId, userId);

      return new Response("", {
        status: 204,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while deleting the comment";

      if (error?.message === "COMMENT_NOT_FOUND") {
        status = 404;
        message = "Comment not found";
      } else if (error?.message === "UNAUTHORIZED") {
        status = 403;
        message = "You do not have permission to delete this comment";
      } else if (error?.message === "COMMENT_DELETE_FAILED") {
        message = "Failed to delete the comment";
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

  static async removeLike(
    data: { postId?: number; commentId?: number },
    userId: number,
  ): Promise<Response> {
    try {
      await ContentService.removeLike(userId, data.postId, data.commentId);

      return new Response("", {
        status: 204,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while removing the like";

      if (error?.message === "INVALID_LIKE_INPUT") {
        status = 400;
        message = "Must provide either postId or commentId, but not both";
      } else if (error?.message === "LIKE_NOT_FOUND") {
        status = 404;
        message = "Like not found";
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

  static async followUser(
    followedUserId: number,
    userId: number,
  ): Promise<Response> {
    try {
      const follow: Follow = await ContentService.followUser(
        userId,
        followedUserId,
      );

      const response = {
        success: true,
        data: {
          follow,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while following the user";

      if (error?.message === "CANNOT_FOLLOW_SELF") {
        status = 400;
        message = "You cannot follow yourself";
      } else if (error?.message === "USER_NOT_FOUND") {
        status = 404;
        message = "User not found";
      } else if (error?.message === "ALREADY_FOLLOWING") {
        status = 409;
        message = "You are already following this user";
      } else if (error?.message === "FOLLOW_CREATION_FAILED") {
        message = "Failed to follow the user";
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

  static async unfollowUser(
    followedUserId: number,
    userId: number,
  ): Promise<Response> {
    try {
      await ContentService.unfollowUser(userId, followedUserId);

      return new Response("", {
        status: 204,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while unfollowing the user";

      if (error?.message === "NOT_FOLLOWING") {
        status = 404;
        message = "You are not following this user";
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

  static async getFeed(userId?: number, cursor?: string): Promise<Response> {
    try {
      const { posts, nextCursor } = await ContentService.getFeed(
        userId,
        cursor,
      );

      const response = {
        success: true,
        data: {
          posts,
          nextCursor,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while fetching the feed";

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

  static async getUserReadList(userId: number): Promise<Response> {
    try {
      const readList = await ContentService.getUserReadList(userId);

      const response = {
        success: true,
        data: {
          readList,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while fetching the read list";

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

  static async removeBookFromReadList(
    userId: number,
    bookId: number,
  ): Promise<Response> {
    try {
      await ContentService.removeBookFromReadList(userId, bookId);

      return new Response("", {
        status: 204,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string =
        "An error occurred while removing the book from the read list";

      if (error?.message === "BOOK_NOT_IN_READ_LIST") {
        status = 404;
        message = "Book not found in your read list";
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

  static async addBookToReadList(
    userId: number,
    bookData: {
      googleBookId: string;
      title: string;
      authors?: string[];
      description?: string;
      coverImageURL?: string;
    },
  ): Promise<Response> {
    try {
      const book = await ContentService.addBookToReadList(userId, bookData);

      const response = {
        success: true,
        data: {
          book,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string =
        "An error occurred while adding the book to the read list";

      if (error?.message === "BOOK_ALREADY_IN_READ_LIST") {
        status = 400;
        message = "This book is already in your read list";
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

  static async getTrendingBooks() {
    try {
      const trendingBooks = await ContentService.getTrendingBooks();

      const response = {
        success: true,
        data: {
          trendingBooks,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      let status = 500;
      let message = "An error occurred while fetching the trending books";
    }
  }
}

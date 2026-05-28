import { eq, and } from "drizzle-orm";
import { db } from "../database/db";
import { posts, comments, likes } from "../database/schema";
import { Like, Post, PostInsert, Comment } from "../types/Content";
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

  static async addLike(
    userId: number,
    postId?: number,
    commentId?: number,
  ): Promise<Like> {
    try {
      // Validate input: must have either postId or commentId, not both
      const hasPostId = postId !== undefined && postId !== null;
      const hasCommentId = commentId !== undefined && commentId !== null;

      if (!hasPostId && !hasCommentId) {
        throw new Error("INVALID_LIKE_INPUT");
      }

      if (hasPostId && hasCommentId) {
        throw new Error("INVALID_LIKE_INPUT");
      }

      // If liking a post, verify it exists
      if (hasPostId) {
        const postExists = await db
          .select({ id: posts.id })
          .from(posts)
          .where(eq(posts.id, postId!))
          .execute();

        if (postExists.length === 0) {
          throw new Error("POST_NOT_FOUND");
        }
      }

      // If liking a comment, verify it exists
      if (hasCommentId) {
        const commentExists = await db
          .select({ id: comments.id })
          .from(comments)
          .where(eq(comments.id, commentId!))
          .execute();

        if (commentExists.length === 0) {
          throw new Error("COMMENT_NOT_FOUND");
        }
      }

      // Insert the like
      const newLike = await db
        .insert(likes)
        .values({
          userId,
          postId: hasPostId ? postId : null,
          commentId: hasCommentId ? commentId : null,
        })
        .returning()
        .execute();

      if (newLike.length === 0) {
        throw new Error("LIKE_CREATION_FAILED");
      }

      return newLike[0] as Like;
    } catch (error: any) {
      // Handle duplicate like (unique constraint violation)
      if (error?.code === "23505") {
        throw new Error("ALREADY_LIKED");
      }

      console.error("Add like error:", error?.message ?? error);
      throw error;
    }
  }

  static async addComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<Comment> {
    try {
      // Verify the post exists
      const postExists = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.id, postId))
        .execute();

      if (postExists.length === 0) {
        throw new Error("POST_NOT_FOUND");
      }

      // Insert the comment
      const newComment = await db
        .insert(comments)
        .values({
          userId,
          postId,
          content,
        })
        .returning()
        .execute();

      if (newComment.length === 0) {
        throw new Error("COMMENT_CREATION_FAILED");
      }

      return newComment[0] as Comment;
    } catch (error: any) {
      console.error("Add comment error:", error?.message ?? error);
      throw error;
    }
  }
}

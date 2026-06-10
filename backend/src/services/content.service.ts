import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "../database/db";
import {
  posts,
  comments,
  likes,
  follows,
  users,
  books,
  usersBooks,
} from "../database/schema";
import {
  Like,
  Post,
  PostInsert,
  Comment,
  Follow,
  FeedPost,
  LocalBook,
  LocalBookInsert,
  PostComments,
} from "../types/Content";
import { GoogleBooksApiResponse } from "../types/GoogleBooks";

export class ContentService {
  private static async getLocalBook(
    googleBookId: string,
  ): Promise<LocalBook | null> {
    try {
      const localBook = await db
        .select()
        .from(books)
        .where(eq(books.googleBookId, googleBookId))
        .execute();

      if (localBook.length === 0) {
        return null;
      }

      return localBook[0];
    } catch (error: any) {
      console.error(
        `Error occured when fetching local book: ${error?.message}`,
      );
      return null;
    }
  }

  private static async insertLocalBook(
    book: LocalBookInsert,
  ): Promise<LocalBook> {
    const localBook = await db
      .insert(books)
      .values({
        googleBookId: book.googleBookId,
        title: book.title,
        authors: book.authors,
        description: book.description || null,
        coverImageURL: book.coverImageURL || null,
      })
      .returning()
      .execute();

    if (localBook.length === 0) {
      throw new Error("LOCAL_BOOK_INSERTION_FAILED");
    }

    return localBook[0];
  }

  static async getPostsByUserId(userId: number): Promise<Post[]> {
    try {
      const userPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, userId))
        .execute();

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
        .select({
          id: posts.id,
          content: posts.content,
          createdAt: posts.createdAt,
          userId: posts.userId,
          bookId: posts.bookId,
          user: {
            id: users.id,
            username: users.username,
            name: users.name,
            profilePicture: users.profilePicture,
          },
          book: {
            googleBookId: books.googleBookId,
            title: books.title,
            authors: books.authors,
            description: books.description,
            coverImageURL: books.coverImageURL,
          },
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .leftJoin(books, eq(posts.bookId, books.id))
        .where(eq(posts.id, postId))
        .execute();

      if (post.length === 0) {
        throw new Error("POST_NOT_FOUND");
      }

      return post[0];
    } catch (error: any) {
      console.error("Get post by ID error:", error?.message ?? error);
      throw error;
    }
  }

  static async getCommentsForPost(postId: number): Promise<PostComments[]> {
    try {
      const postComments = await db
        .select({
          id: comments.id,
          content: comments.content,
          createdAt: comments.createdAt,
          postId: comments.postId,
          user: {
            id: users.id,
            username: users.username,
            name: users.name,
            profilePicture: users.profilePicture,
          },
        })
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.postId, postId))
        .orderBy(desc(comments.createdAt))
        .execute();

      return postComments as PostComments[];
    } catch (error: any) {
      console.error("Get comments for post error:", error?.message ?? error);
      throw error;
    }
  }

  static async createPost(postData: PostInsert, userId: number): Promise<Post> {
    try {
      const { content, book } = postData;
      let localBook: LocalBook | null = null;

      if (book !== undefined) {
        localBook = await this.getLocalBook(book.googleBookId);

        if (localBook == null) {
          localBook = await this.insertLocalBook(book);
        }
      }

      const newPost = await db
        .insert(posts)
        .values({
          userId,
          content,
          bookId: localBook !== null ? localBook.id : null,
        })
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
      if (error?.code === "23503") {
        if (error?.message?.includes("likes_postId_fkey")) {
          throw new Error("POST_NOT_FOUND");
        }
        if (error?.message?.includes("likes_commentId_fkey")) {
          throw new Error("COMMENT_NOT_FOUND");
        }
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

  static async editPost(
    postId: number,
    userId: number,
    data: { content?: string; bookId?: number },
  ): Promise<Post> {
    try {
      // Verify the post exists
      const postToEdit: Post[] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, postId))
        .execute();

      if (postToEdit.length === 0) {
        throw new Error("POST_NOT_FOUND");
      }

      // Verify user owns the post
      if (postToEdit[0].userId !== userId) {
        throw new Error("UNAUTHORIZED");
      }

      // Prepare update data (only include provided fields)
      const updateData: Record<string, string | number> = {};
      if (data.content !== undefined) {
        updateData.content = data.content;
      }
      if (data.bookId !== undefined) {
        updateData.bookId = data.bookId;
      }

      // Update the post
      const updatedPost = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, postId))
        .returning()
        .execute();

      if (updatedPost.length === 0) {
        throw new Error("POST_UPDATE_FAILED");
      }

      return updatedPost[0] as Post;
    } catch (error: any) {
      console.error("Edit post error:", error?.message ?? error);
      throw error;
    }
  }

  static async deletePost(postId: number, userId: number): Promise<void> {
    try {
      const postToDelete: Post[] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, postId))
        .execute();

      if (postToDelete.length === 0) {
        throw new Error("POST_NOT_FOUND");
      }

      if (postToDelete[0].userId !== userId) {
        throw new Error("UNAUTHORIZED");
      }

      const deletedPost = await db
        .delete(posts)
        .where(eq(posts.id, postId))
        .returning()
        .execute();

      if (deletedPost.length === 0) {
        throw new Error("POST_DELETE_FAILED");
      }
    } catch (error: any) {
      console.error("Delete post error:", error?.message ?? error);
      throw error;
    }
  }

  static async deleteComment(commentId: number, userId: number): Promise<void> {
    try {
      const commentToDelete: Comment[] = await db
        .select()
        .from(comments)
        .where(eq(comments.id, commentId))
        .execute();

      if (commentToDelete.length === 0) {
        throw new Error("COMMENT_NOT_FOUND");
      }

      if (commentToDelete[0].userId !== userId) {
        throw new Error("UNAUTHORIZED");
      }

      const deletedComment = await db
        .delete(comments)
        .where(eq(comments.id, commentId))
        .returning()
        .execute();

      if (deletedComment.length === 0) {
        throw new Error("COMMENT_DELETE_FAILED");
      }
    } catch (error: any) {
      console.error("Delete comment error:", error?.message ?? error);
      throw error;
    }
  }

  static async removeLike(
    userId: number,
    postId?: number,
    commentId?: number,
  ): Promise<void> {
    try {
      const hasPostId = postId !== undefined && postId !== null;
      const hasCommentId = commentId !== undefined && commentId !== null;

      if (!hasPostId && !hasCommentId) {
        throw new Error("INVALID_LIKE_INPUT");
      }

      if (hasPostId && hasCommentId) {
        throw new Error("INVALID_LIKE_INPUT");
      }

      const deletedLike = await db
        .delete(likes)
        .where(
          and(
            eq(likes.userId, userId),
            hasPostId
              ? eq(likes.postId, postId!)
              : eq(likes.commentId, commentId!),
          ),
        )
        .returning()
        .execute();

      if (deletedLike.length === 0) {
        throw new Error("LIKE_NOT_FOUND");
      }
    } catch (error: any) {
      console.error("Remove like error:", error?.message ?? error);
      throw error;
    }
  }

  static async followUser(
    followerId: number,
    followedId: number,
  ): Promise<Follow> {
    try {
      if (followerId === followedId) {
        throw new Error("CANNOT_FOLLOW_SELF");
      }

      const followedUserExists = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, followedId))
        .limit(1)
        .execute();

      if (followedUserExists.length === 0) {
        throw new Error("USER_NOT_FOUND");
      }

      const newFollow = await db
        .insert(follows)
        .values({
          followerId,
          followedId,
        })
        .returning()
        .execute();

      if (newFollow.length === 0) {
        throw new Error("FOLLOW_CREATION_FAILED");
      }

      return newFollow[0] as Follow;
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new Error("ALREADY_FOLLOWING");
      }

      console.error("Follow user error:", error?.message ?? error);
      throw error;
    }
  }

  static async unfollowUser(
    followerId: number,
    followedId: number,
  ): Promise<void> {
    try {
      const deletedFollow = await db
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, followerId),
            eq(follows.followedId, followedId),
          ),
        )
        .returning()
        .execute();

      if (deletedFollow.length === 0) {
        throw new Error("NOT_FOLLOWING");
      }
    } catch (error: any) {
      console.error("Unfollow user error:", error?.message ?? error);
      throw error;
    }
  }

  static async getFeed(
    userId?: number,
    cursor?: string,
  ): Promise<{ posts: FeedPost[]; nextCursor: string | null }> {
    try {
      // 1. Decode the cursor
      let cursorDate: Date | null = null;
      let cursorIsFollowed: boolean | null = null;

      if (cursor) {
        const decoded = JSON.parse(
          Buffer.from(cursor, "base64").toString("utf-8"),
        );

        cursorDate = new Date(decoded.date);
        cursorIsFollowed = decoded.isFollowed;
      }

      // 2. Define the subquery for "Is followed by me"
      let isFollowedQuery;
      if (userId !== undefined) {
        isFollowedQuery = sql<boolean>`EXISTS (
          SELECT 1 FROM ${follows}
          WHERE ${follows.followedId} = ${posts.userId}
          AND ${follows.followerId} = ${userId}
        )`;
      } else {
        isFollowedQuery = sql<boolean>`FALSE`;
      }

      // 3. Define the pagination condition
      let paginationCondition = undefined;

      if (cursorDate && cursorIsFollowed !== null) {
        if (cursorIsFollowed) {
          // If the last post was from a follower, get older follower posts,
          // OR fallback to global posts (which have an older priority in our sort)
          paginationCondition = sql`(${isFollowedQuery} AND ${posts.createdAt} < ${cursorDate}) OR (NOT ${isFollowedQuery})`;
        } else {
          // If we are already in the global section of the feed, just get older global posts
          paginationCondition = sql`NOT ${isFollowedQuery} AND ${posts.createdAt} < ${cursorDate}`;
        }
      }

      const orderByCondition =
        userId !== undefined
          ? [desc(isFollowedQuery), desc(posts.createdAt)]
          : [desc(posts.createdAt)];

      // 4. The query
      const feed: FeedPost[] = await db
        .select({
          id: posts.id,
          content: posts.content,
          createdAt: posts.createdAt,
          bookId: posts.bookId,
          author: {
            id: users.id,
            username: users.username,
            name: users.name,
            profilePicture: users.profilePicture,
          },
          metrics: {
            likeCount: sql<number>`(SELECT COUNT(*)::int FROM ${likes} WHERE ${likes.postId} = ${posts.id})`,
            commentCount: sql<number>`(SELECT COUNT(*)::int FROM ${comments} WHERE ${comments.postId} = ${posts.id})`,
          },
          context: {
            isLikedByMe:
              userId != undefined
                ? sql<boolean>`EXISTS (
            SELECT 1 FROM ${likes}
            WHERE ${likes.postId} = ${posts.id}
            AND ${likes.userId} = ${userId}
          )`
                : sql<boolean>`FALSE`,
            isMine:
              userId != undefined
                ? sql<boolean>`${posts.userId} = ${userId}`
                : sql<boolean>`FALSE`,
            isFollowed: isFollowedQuery,
          },
        })
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
        .where(paginationCondition)
        .orderBy(...orderByCondition)
        .limit(20)
        .execute();

      // 5. Define the next cursor
      let nextCursor: string | null = null;
      if (feed.length === 20) {
        const lastPost = feed[feed.length - 1];
        const cursorData = {
          date: lastPost.createdAt,
          isFollowed: lastPost.context.isFollowed,
        };

        nextCursor = Buffer.from(JSON.stringify(cursorData)).toString("base64");
      }

      return {
        posts: feed as FeedPost[],
        nextCursor, // If null, the frontend knows there are no more posts!
      };
    } catch (error: any) {
      console.error(`An Error occuered while fetching feed: ${error.message}`);
      throw error;
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
  ): Promise<LocalBook> {
    try {
      // 1. See if the book exists in local db
      const localBook: LocalBook | null = await this.getLocalBook(
        bookData.googleBookId,
      );

      let bookId: number;
      let newBook: LocalBook | null = null;
      if (localBook == null) {
        // if it doesn't exist insert it
        newBook = await this.insertLocalBook(bookData);

        bookId = newBook.id;
      } else {
        bookId = localBook.id;
      }

      // 2. See if the book is already added by the user
      const alreadyAdded = await db
        .select()
        .from(usersBooks)
        .where(
          and(eq(usersBooks.userId, userId), eq(usersBooks.bookId, bookId)),
        )
        .execute();

      if (alreadyAdded.length > 0) {
        throw new Error("BOOK_ALREADY_IN_READ_LIST");
      }

      // otherwise insert it
      await db
        .insert(usersBooks)
        .values({ userId, bookId })
        .returning()
        .execute();

      return newBook ? newBook : (localBook as LocalBook);
    } catch (error: any) {
      console.error("Add book error:", error?.message ?? error);
      throw error;
    }
  }

  static async removeBookFromReadList(
    userId: number,
    bookId: number,
  ): Promise<void> {
    try {
      const result = await db
        .delete(usersBooks)
        .where(
          and(eq(usersBooks.userId, userId), eq(usersBooks.bookId, bookId)),
        )
        .returning()
        .execute();

      if (result.length === 0) {
        throw new Error("BOOK_NOT_IN_READ_LIST");
      }
    } catch (error: any) {
      console.error("Remove from book list error ", error?.message ?? error);
      throw error;
    }
  }

  static async getUserReadList(userId: number) {
    try {
      const readList = await db
        .select({
          id: books.id,
          googleBookId: books.googleBookId,
          title: books.title,
          authors: books.authors,
          coverImageURL: books.coverImageURL,
          addedAt: usersBooks.createdAt,
        })
        .from(usersBooks)
        .innerJoin(books, eq(usersBooks.bookId, books.id))
        .where(eq(usersBooks.userId, userId))
        .execute();

      return readList;
    } catch (error: any) {
      console.error("Get read list error:", error?.message ?? error);
      throw error;
    }
  }
}

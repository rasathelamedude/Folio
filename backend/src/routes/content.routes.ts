import { Elysia, t } from "elysia";
import { ContentController } from "../controllers/content.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const contentRoutes = new Elysia().group("/api/v1/content", (app) =>
  app
    .get(
      "/books",
      ({ query }) => ContentController.getBookByName(query.book_name),
      {
        query: t.Object({
          book_name: t.String({ minLength: 1 }),
        }),
      },
    )
    .get(
      "/posts/:postID",
      ({ params }) => ContentController.getPostById(params.postID),
      {
        params: t.Object({
          postID: t.Numeric(),
        }),
      },
    )
    .use(authMiddleware)
    // TODO: FIX AUTH ON FEED
    .get(
      "/feed",
      ({ userId, query }) => ContentController.getFeed(userId, query.cursor),
      {
        query: t.Object({
          cursor: t.Optional(t.String()),
        }),
      },
    )
    .get("/users/me/books", ({ userId }) =>
      ContentController.getUserReadList(userId),
    )
    .post(
      "/users/me/books",
      ({ userId, body }) => ContentController.addBookToReadList(userId, body),
      {
        body: t.Object({
          googleBookId: t.String({ minLength: 1 }),
          title: t.String({ minLength: 1 }),
          authors: t.Optional(t.Array(t.String())),
          description: t.Optional(t.String()),
          coverImageURL: t.Optional(t.String()),
        }),
      },
    )
    .delete(
      "/users/me/books/:bookID",
      ({ userId, params }) =>
        ContentController.removeBookFromReadList(userId, params.bookID),
      {
        params: t.Object({
          bookID: t.Numeric(),
        }),
      },
    )
    .get(
      "/users/:userID/posts",
      ({ params }) => ContentController.getPostsByUserId(params.userID),
      {
        params: t.Object({
          userID: t.Numeric(),
        }),
      },
    )
    .post(
      "/posts",
      ({ body, userId }) => ContentController.createPost(body, userId),
      {
        body: t.Object({
          content: t.String({ minLength: 1 }),
          bookId: t.Numeric(),
        }),
      },
    )
    .post(
      "/likes",
      ({ body, userId }) => ContentController.addLike(body, userId),
      {
        body: t.Object(
          {
            postId: t.Optional(t.Numeric()),
            commentId: t.Optional(t.Numeric()),
          },
          {
            minProperties: 1,
          },
        ),
      },
    )
    .post(
      "/comments",
      ({ body, userId }) => ContentController.addComment(body, userId),
      {
        body: t.Object({
          postId: t.Numeric(),
          content: t.String({ minLength: 1 }),
        }),
      },
    )
    .patch(
      "/posts/:postID",
      ({ params, body, userId }) =>
        ContentController.editPost(params.postID, body, userId),
      {
        params: t.Object({
          postID: t.Numeric(),
        }),
        body: t.Object(
          {
            content: t.Optional(t.String({ minLength: 1 })),
            bookId: t.Optional(t.Numeric()),
          },
          {
            minProperties: 1,
          },
        ),
      },
    )
    .delete(
      "/posts/:postID",
      ({ params, userId }) =>
        ContentController.deletePost(params.postID, userId),
      {
        params: t.Object({
          postID: t.Numeric(),
        }),
      },
    )
    .delete(
      "/comments/:commentID",
      ({ params, userId }) =>
        ContentController.deleteComment(params.commentID, userId),
      {
        params: t.Object({
          commentID: t.Numeric(),
        }),
      },
    )
    .delete(
      "/likes",
      ({ query, userId }) =>
        ContentController.removeLike(
          {
            postId: query.postID ? query.postID : undefined,
            commentId: query.commentID ? query.commentID : undefined,
          },
          userId,
        ),
      {
        query: t.Object(
          {
            postID: t.Optional(t.Numeric()),
            commentID: t.Optional(t.Numeric()),
          },
          {
            minProperties: 1,
          },
        ),
      },
    )
    .post(
      "/follows",
      ({ body, userId }) =>
        ContentController.followUser(body.followed_user_id, userId),
      {
        body: t.Object({
          followed_user_id: t.Numeric(),
        }),
      },
    )
    .delete(
      "/follows",
      ({ query, userId }) =>
        ContentController.unfollowUser(query.followingUserId, userId),
      {
        query: t.Object({
          followingUserId: t.Numeric(),
        }),
      },
    ),
);

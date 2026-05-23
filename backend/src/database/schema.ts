import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name"),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password"),
  googleId: text("google_id").unique(),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const books = pgTable("books", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description"),
  coverImageURL: text("cover_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersBooks = pgTable("users_books", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  bookId: integer("book_id")
    .references(() => books.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  bookId: integer("book_id")
    .references(() => books.id, {
      onDelete: "cascade",
    })
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  postId: integer("post_id")
    .references(() => posts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const likes = pgTable(
  "likes",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    postId: integer("post_id").references(() => posts.id, {
      onDelete: "cascade",
    }),
    commentId: integer("comment_id").references(() => comments.id, {
      onDelete: "cascade",
    }),
    userId: integer("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "comment_id_or_post_id",
      sql`(${table.commentId} IS NOT NULL AND ${table.postId} IS NULL) OR (${table.postId} IS NOT NULL AND ${table.commentId} IS NULL)`,
    ),
    unique("unique_post_like").on(table.userId, table.postId),
    unique("unique_comment_like").on(table.userId, table.commentId),
  ],
);

export const follows = pgTable(
  "follows",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    followerId: integer("follower_user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    followedId: integer("followed_user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique("unique_follow").on(table.followerId, table.followedId)],
);

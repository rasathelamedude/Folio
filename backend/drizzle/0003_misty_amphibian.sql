ALTER TABLE "books" ALTER COLUMN "author" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "google_book_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_google_book_id_unique" UNIQUE("google_book_id");--> statement-breakpoint
ALTER TABLE "users_books" ADD CONSTRAINT "unique_user_book" UNIQUE("user_id","book_id");
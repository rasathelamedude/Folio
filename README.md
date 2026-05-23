# Folio

> _Read. Reflect. Share._

Folio is a social platform for book readers — a space to share insights, quotes, and real-life implementations from the books you read. Think LinkedIn for intellectual growth: less formal, more human, and built around the idea that what you read shapes who you become.

---

## What It Is

Most social media rewards reaction. Folio rewards reflection.

Post about a book you finished. Share a quote that stopped you mid-page. Tell people how you implemented an idea from a chapter into your daily life. Follow readers whose taste you trust. Build a library that says something about you.

---

## Tech Stack

| Layer    | Technology          | Why                                             |
| -------- | ------------------- | ----------------------------------------------- |
| Mobile   | React Native + Expo | Cross-platform MVP, familiar React model        |
| Backend  | Bun + ElysiaJS      | Fast runtime, native TypeScript, built for Bun  |
| Database | PostgreSQL          | Relational data with complex join relationships |
| ORM      | Drizzle             | Lightweight, fully type-safe, no heavy binaries |
| Auth     | JWT + Google OAuth  | Stateless auth suited for mobile clients        |

---

## Project Structure

```
folio/
├── frontend/         # React Native + Expo mobile app
└── backend/          # Bun + Elysia REST API
    ├── drizzle/      # Auto-generated migration files
    ├── src/
    │   ├── routes/       # Endpoint definitions
    │   ├── controllers/  # Request handlers
    │   ├── services/     # Business logic
    │   ├── database/     # Drizzle client + schema
    │   ├── middleware/   # Auth + error handling
    │   ├── types/        # Shared TypeScript types
    │   └── lib/          # Third-party integrations (Google Books, OAuth)
    ├── drizzle.config.ts
    └── .env
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 18 (for Expo)
- PostgreSQL database

### Backend

```bash
cd backend
bun install
cp .env.example .env   # fill in your environment variables
bun run db:migrate     # run database migrations
bun run dev            # start the development server
```

### Frontend

```bash
cd frontend
npx expo install
npx expo start
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/folio
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

---

## Status

🚧 Active development — MVP in progress.

---

_Built for readers, by a reader._

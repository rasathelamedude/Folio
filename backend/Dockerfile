FROM oven/bun:1-slim AS builder

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

COPY . .

FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["sh", "-c", "bun run db:migrate && bun run start"]
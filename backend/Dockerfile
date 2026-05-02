FROM node:20-slim AS builder
WORKDIR /app/backend

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

COPY backend/package.json backend/prisma ./
COPY prisma ../prisma

RUN pnpm install
RUN pnpm exec prisma generate --schema=../prisma/schema.prisma
COPY backend/src ./src
COPY backend/nest-cli.json backend/tsconfig*.json ./
RUN pnpm run build

FROM node:20-slim AS runner
WORKDIR /app/backend

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

COPY backend/package.json ./
RUN pnpm install --prod
RUN pnpm exec prisma generate --schema=../prisma/schema.prisma

COPY --from=builder /app/backend/dist ./dist
COPY prisma ../prisma

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["node", "dist/main.js"]

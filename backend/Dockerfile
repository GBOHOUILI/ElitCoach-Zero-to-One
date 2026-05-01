# -------------------------
# BUILD STAGE
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend ./backend
COPY shared ./shared
COPY prisma ./prisma

RUN pnpm install

WORKDIR /app/backend

# Prisma generate avant build
RUN pnpm exec prisma generate

# Build NestJS
RUN pnpm run build


# -------------------------
# RUNTIME STAGE
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY backend/package.json ./backend/package.json
COPY backend/prisma ./backend/prisma
COPY backend/dist ./backend/dist
COPY shared ./shared

RUN pnpm install --prod

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

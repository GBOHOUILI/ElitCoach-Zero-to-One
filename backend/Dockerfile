FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm
RUN corepack enable

# Workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Full repo
COPY backend ./backend
COPY shared ./shared
COPY prisma ./prisma

# Install all deps
RUN pnpm install

# Move into backend
WORKDIR /app/backend

# Build
RUN pnpm run build

# Prisma generate (IMPORTANT après install + dans backend)
RUN pnpm exec prisma generate


# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm
RUN corepack enable

# Copy only needed output
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared ./shared
COPY backend/package.json ./backend/package.json
COPY backend/prisma ./backend/prisma
COPY prisma ./prisma

# Install only production deps (safe mode)
RUN pnpm install --prod

WORKDIR /app/backend

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]

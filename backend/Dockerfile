# =========================
# 1. BASE
# =========================
FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm


# =========================
# 2. INSTALL DEPENDENCIES
# =========================
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json

RUN pnpm install --frozen-lockfile


# =========================
# 3. BUILD STAGE
# =========================
FROM base AS builder

WORKDIR /app

COPY . .

RUN pnpm install

# Prisma generate (IMPORTANT: backend scope)
RUN pnpm --filter backend exec prisma generate

# Build NestJS backend
RUN pnpm --filter backend run build


# =========================
# 4. RUNTIME (PRODUCTION)
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

ENV NODE_ENV=production
ENV PORT=3001

# install ONLY production deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json

RUN pnpm install --prod --frozen-lockfile


# =========================
# 5. COPY BUILT APP
# =========================
COPY --from=builder /app/backend/dist ./backend/dist

# Prisma runtime engine (IMPORTANT)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "dist/main.js"]

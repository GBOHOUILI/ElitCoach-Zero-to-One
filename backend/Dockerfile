# -------------------------
# BUILD STAGE
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# dépendances système pour Prisma
RUN apk add --no-cache openssl libc6-compat

# copier tout le monorepo
COPY . .

# installer toutes les dépendances (important pour workspace + Prisma)
RUN pnpm install

# aller dans backend
WORKDIR /app/backend

# générer Prisma client (IMPORTANT)
RUN pnpm exec prisma generate

# build NestJS
RUN pnpm run build


# -------------------------
# RUNTIME STAGE
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# dépendances système nécessaires à Prisma
RUN apk add --no-cache openssl libc6-compat

RUN npm install -g pnpm

# copier monorepo (important pour workspace resolution)
COPY . .

# installer les dépendances (NE PAS filtrer sinon Nest casse)
RUN pnpm install

# régénérer Prisma dans runtime (CRUCIAL pour éviter .prisma error)
WORKDIR /app/backend
RUN pnpm exec prisma generate

# copier build backend
COPY --from=builder /app/backend/dist ./backend/dist

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

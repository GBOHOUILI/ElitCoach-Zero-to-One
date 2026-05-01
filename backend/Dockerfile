# -------------------------
# BUILD STAGE
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# dépendances système nécessaires pour Prisma
RUN apk add --no-cache openssl libc6-compat

COPY . .

# install deps (monorepo)
RUN pnpm install

WORKDIR /app/backend

# Prisma generate
RUN pnpm exec prisma generate

# build NestJS
RUN pnpm run build


# -------------------------
# RUNTIME STAGE
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# IMPORTANT: OpenSSL pour Prisma
RUN apk add --no-cache openssl libc6-compat

RUN npm install -g pnpm

# copier configs PNPM (monorepo)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# installer seulement les deps backend
RUN pnpm install --prod --filter backend...

# copier build backend
COPY --from=builder /app/backend/dist ./backend/dist

# (optionnel mais utile si Prisma runtime manque)
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

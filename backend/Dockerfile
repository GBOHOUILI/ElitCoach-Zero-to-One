# =========================
# BUILD
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm --filter backend exec prisma generate
RUN pnpm --filter backend run build

# =========================
# RUNTIME
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

# Copier TOUT le monorepo (source + configs)
COPY . .

# Install complet (pas --prod) pour avoir prisma CLI
RUN pnpm install --frozen-lockfile

# Générer Prisma dans le bon contexte
RUN pnpm --filter backend exec prisma generate

# Écraser le dist avec celui du builder (compilé proprement)
COPY --from=builder /app/backend/dist /app/backend/dist

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

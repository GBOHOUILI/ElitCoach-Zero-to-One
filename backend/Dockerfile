# -------------------------
# BUILD
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install

# IMPORTANT : Prisma généré depuis ROOT workspace
RUN pnpm exec prisma generate

# build backend
RUN pnpm --filter backend run build


# -------------------------
# RUNTIME
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# install prod deps only
RUN pnpm install --prod

# backend build
COPY --from=builder /app/backend/dist /app/backend/dist

# Prisma runtime (IMPORTANT: depuis root)
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

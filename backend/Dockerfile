# -------------------------
# BUILD STAGE
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

# install ALL deps (important pour prisma generate)
RUN pnpm install

WORKDIR /app/backend

# generate prisma client
RUN pnpm exec prisma generate

# build nest
RUN pnpm run build


# -------------------------
# RUNTIME STAGE
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# install prod deps only
RUN pnpm install --prod

# copy backend build
COPY --from=builder /app/backend/dist ./backend/dist

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

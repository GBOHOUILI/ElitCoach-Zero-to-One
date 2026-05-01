FROM node:20-alpine AS builder
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY shared ./shared
COPY backend/package.json ./backend/

# Install pnpm
RUN npm install -g pnpm

# Install deps
COPY backend ./backend
COPY prisma ./backend/prisma

RUN pnpm install --filter elitcoach-backend --frozen-lockfile

# Build
WORKDIR /app/backend
RUN pnpm run build

# Generate Prisma client
RUN pnpm exec prisma generate

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main"]

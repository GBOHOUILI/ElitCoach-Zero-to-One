FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install

# Prisma ONLY ici
RUN pnpm --filter backend exec prisma generate

# build backend ONLY
RUN pnpm --filter backend run build


FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod

# backend build output
COPY --from=builder /app/backend/dist ./backend/dist

# Prisma runtime (OK)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "dist/main.js"]

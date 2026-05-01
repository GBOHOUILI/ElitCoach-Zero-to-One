FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm
RUN apk add --no-cache openssl libc6-compat

COPY . .

RUN pnpm install

WORKDIR /app/backend

# Prisma generate dans backend ONLY
RUN pnpm exec prisma generate

RUN pnpm run build


FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

COPY . .

RUN pnpm install --prod

WORKDIR /app/backend

# ❌ NO copy of root prisma
# ❌ NO node_modules/.prisma copy

# ✔ rebuild Prisma runtime-safe (simple & stable)
RUN pnpm exec prisma generate

# ✔ correct build copy
COPY --from=builder /app/backend/dist ./dist

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

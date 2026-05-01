# -------------------------
# BUILD STAGE
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

# install ALL deps (dev + prod)
RUN pnpm install

WORKDIR /app/backend

# generate prisma client (OK car dev deps présentes)
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

# install ONLY prod deps
RUN pnpm install --prod

# copy build output
COPY --from=builder /app/backend/dist ./backend/dist

# ⚠️ IMPORTANT: prisma client doit aussi exister dans runtime
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm
RUN apk add --no-cache openssl libc6-compat

COPY . .

# IMPORTANT: installer workspace correctement
RUN pnpm install --frozen-lockfile

# build backend explicitement dans workspace
RUN pnpm --filter backend run build

# Prisma generate dans backend workspace
RUN pnpm --filter backend exec prisma generate


FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

COPY . .

# install production deps proprement
RUN pnpm install --prod --frozen-lockfile

# Prisma runtime safety
RUN pnpm --filter backend exec prisma generate

# copie du build backend (IMPORTANT: workspace path correct)
COPY --from=builder /app/backend/dist ./backend/dist

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "backend/dist/main.js"]

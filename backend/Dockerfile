FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm
RUN apk add --no-cache openssl libc6-compat

COPY . .

# INSTALL FULL (IMPORTANT: Prisma CLI doit exister)
RUN pnpm install

WORKDIR /app/backend

# Prisma generate ICI uniquement
RUN pnpm exec prisma generate

# build backend
RUN pnpm run build


FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

COPY . .

# install prod deps uniquement
RUN pnpm install --prod

WORKDIR /app/backend

# ❌ IMPORTANT: NO prisma generate ici
# (sinon casse car CLI absent)

# copy build
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

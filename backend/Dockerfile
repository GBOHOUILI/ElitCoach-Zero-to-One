FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm
RUN apk add --no-cache openssl libc6-compat

COPY . .

# FULL install (prisma CLI présent ici)
RUN pnpm install

WORKDIR /app/backend

# Prisma OK ici
RUN pnpm exec prisma generate

# Build Nest
RUN pnpm run build


FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

COPY . .

# prod install ONLY (pas de prisma CLI ici, normal)
RUN pnpm install --prod

WORKDIR /app/backend

# ❌ IMPORTANT: NO prisma generate ici

# copy build
COPY --from=builder /app/backend/dist ./dist

# Prisma client déjà généré dans builder → OK
COPY --from=builder /app/backend/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

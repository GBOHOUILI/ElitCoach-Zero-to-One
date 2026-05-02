FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm
COPY . .
RUN echo "enable-pre-post-scripts=true" >> .npmrc
RUN pnpm install --config.unsafe-perm=true
RUN cd backend && npx prisma generate --schema=../prisma/schema.prisma
RUN pnpm --filter backend run build
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm
COPY . .
RUN echo "enable-pre-post-scripts=true" >> .npmrc
RUN pnpm install --frozen-lockfile --config.unsafe-perm=true
RUN cd backend && npx prisma generate --schema=../prisma/schema.prisma
COPY --from=builder /app/backend/dist /app/backend/dist
WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["node", "dist/main.js"]

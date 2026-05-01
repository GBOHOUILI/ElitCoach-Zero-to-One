# -------------------------
# RUNTIME STAGE
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY backend/package.json ./backend/package.json
COPY backend/prisma ./backend/prisma
COPY shared ./shared

RUN pnpm install --prod

# ❌ NE PAS COPY dist

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]

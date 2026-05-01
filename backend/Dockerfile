FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend ./backend
COPY shared ./shared
COPY prisma ./prisma

RUN pnpm install

WORKDIR /app/backend

RUN pnpm run build
RUN pnpm exec prisma generate

EXPOSE 3001

CMD ["node", "dist/main.js"]

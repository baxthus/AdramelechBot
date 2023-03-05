FROM node:alpine

WORKDIR /app

COPY . .

RUN npm i -g pnpm

RUN pnpm install

RUN pnpm run gen-json

CMD ["pnpm", "tsx", "src/bot.ts"]
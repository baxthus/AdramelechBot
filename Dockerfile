FROM node:19

WORKDIR /app

COPY . .

RUN npm i -g pnpm

RUN pnpm install

RUN pnpm run build

CMD ["node", "dist/bot.js"]
FROM oven/bun:1.4.2-alpine

WORKDIR /usr/api

COPY package.json ./

RUN bun install --production

COPY / .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", "--preload", "@sentry/node/preload", "src/index.ts"]

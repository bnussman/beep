FROM oven/bun:canary-alpine

WORKDIR /usr/api

COPY package.json ./

RUN bun install --production

COPY / .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", "--preload", "@sentry/bun/import", "src/index.ts"]

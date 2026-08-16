FROM oven/bun:canary-alpine

WORKDIR /usr/api

COPY package.json ./

RUN bun install --production

COPY / .

EXPOSE 3001

ENV NODE_ENV=production

CMD ["bun", "run", "--preload", "@sentry/node/preload", "src/index.ts"]

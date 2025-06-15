FROM oven/bun:canary-alpine

WORKDIR /usr/api

COPY package.json ./

RUN bun install

COPY / .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", "--preload", "./src/utils/instrument.ts", "src/index.ts"]

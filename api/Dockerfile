FROM oven/bun:alpine

WORKDIR /usr/api

COPY package.json ./

RUN bun install

COPY / .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", "src/index.ts" ]

FROM oven/bun:1.1.4-alpine

WORKDIR /usr/api

COPY api/package.json ./

RUN bun install

COPY api/ .

RUN bun run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", "build/index.js" ]

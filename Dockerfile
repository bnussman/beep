FROM oven/bun:canary

WORKDIR /usr/api

COPY api/package.json ./

RUN bun install

COPY api/ .

RUN bun tsc

EXPOSE 3000

CMD [ "bun", "run", "build/index.js" ]

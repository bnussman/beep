FROM node:current-alpine
FROM mcr.microsoft.com/playwright:focal

WORKDIR /usr/api

COPY api/package.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY api/ .

RUN npx tsc

EXPOSE 3001

CMD [ "node", "build/index.js" ]

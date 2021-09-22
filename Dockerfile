FROM node:current-alpine

WORKDIR /usr/api

COPY api/package*.json ./

RUN npm ci

COPY api/ .

RUN npx tsc

EXPOSE 3001

CMD [ "node", "build/src/server.js" ]

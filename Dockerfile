FROM node:latest

WORKDIR /usr/api

COPY api/package*.json .

RUN npm ci --quiet --only=production && npm install typescript -g

COPY api/ .

RUN npm run build

EXPOSE 3001

CMD [ "node", "build/server.js" ]

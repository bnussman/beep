FROM node:current-alpine

WORKDIR /usr/api

COPY api/build ./

EXPOSE 3001

CMD [ "node", "build/src/index.js" ]

FROM node:current-alpine

COPY api/build ./

EXPOSE 3001

CMD [ "node", "build/src/index.js" ]

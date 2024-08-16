import ws from 'ws';
// import cors from 'cors';
import { createContext, router } from './utils/trpc';
import { userRouter } from './routers/user';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const appRouter = router({
  user: userRouter,
});

const server = createHTTPServer({
  middleware: (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if ('OPTIONS' === req.method) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Whatever you wish to send \n')
    } else {
      next();
    }
  },
  // middleware: cors(),
  router: appRouter,
  createContext,
})

const wss = new ws.Server({
  server,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
});

server.listen(3001);

export type AppRouter = typeof appRouter;

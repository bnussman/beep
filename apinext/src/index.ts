import ws from 'ws';
import cors from 'cors';
import { createContext, router } from './utils/trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { userRouter } from './routers/user';

const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;

const httpServer = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

const wss = new ws.Server({ server: httpServer });

applyWSSHandler<AppRouter>({
  onError: console.error,
  wss,
  router: appRouter,
  createContext,
});

httpServer.listen(3001);

import * as Sentry from "@sentry/bun";
import ws from 'ws';
import cors from 'cors';
import { createContext, router } from './utils/trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { userRouter } from './routers/user';
import { authRouter } from './routers/auth';

Sentry.init({
  dsn: "https://c00b90fd57886f1b49fb31b9d52142de@o1155818.ingest.us.sentry.io/4507799279435776",
  tracesSampleRate: 1.0,
});

const appRouter = router({
  user: userRouter,
  auth: authRouter,
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

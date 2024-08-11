import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { authedProcedure, createContext, publicProcedure, router } from './trpc';

const appRouter = router({
  me: authedProcedure.query(({ ctx }) => {
    return ctx.user;
  })
});

Bun.serve({
  port: 3001,
  fetch(req) {
    return fetchRequestHandler({
      endpoint: '/trpc',
      router: appRouter,
      req,
      createContext
    });
  },
});

export type AppRouter = typeof appRouter;

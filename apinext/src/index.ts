import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext, publicProcedure, router } from './trpc';

const appRouter = router({
  me: publicProcedure.query(() => {
    return "hey";
  })
});

Bun.serve({
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

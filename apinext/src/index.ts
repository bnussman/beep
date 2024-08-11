import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext, router } from './trpc';
import { CORS_HEADERS } from './constants';
import { userRouter } from './routers/user';

const appRouter = router({
  user: userRouter,
});

Bun.serve({
  port: 3001,
  fetch(req) {
    if (req.method === 'OPTIONS') {
      return new Response('Departed', { headers: CORS_HEADERS });
    }
    return fetchRequestHandler({
      endpoint: '/trpc',
      router: appRouter,
      req,
      onError: console.error,
      responseMeta: () => ({
        headers: CORS_HEADERS,
      }),
      createContext
    });
  },
});

export type AppRouter = typeof appRouter;

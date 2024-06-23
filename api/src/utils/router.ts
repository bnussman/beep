import { publicProcedure, router } from './trpc';

export const appRouter = router({
  test: publicProcedure.query(() => "hey!")
});

export type AppRouter = typeof appRouter;
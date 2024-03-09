import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors' 
import { trpc } from '@elysiajs/trpc' 
import { createContext } from './context';
import { t } from './trpc';
import { z } from 'zod';

const appRouter = t.router({
  user: t.procedure.query(({ ctx }) => {
    return ctx.user;
  }),
  updateUser: t. procedure.input(
    z.object({
      name: z.string(),
    })
  ).mutation(({ input }) => {
    return "OMG!";
  })
});

export type AppRouter = typeof appRouter;

const app = new Elysia()
  .use(cors())
  .use(
    trpc(appRouter, { endpoint: '/trpc', createContext })
  )
  .listen(3001);
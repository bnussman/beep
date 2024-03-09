import { createContext } from './context';
import { t } from './trpc';
import { z } from 'zod';
import { observable } from '@trpc/server/observable';

import { EventEmitter } from 'stream';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { WebSocketServer } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import cors from 'cors';

const ee = new EventEmitter()

const appRouter = t.router({
  user: t.procedure.query(({ ctx }) => {
    return ctx.user;
  }),
  updateUser: t.procedure.input(
    z.object({
      name: z.string(),
    })
  ).mutation(({ input }) => {
    return "OMG!";
  }),
  listen: t.procedure.subscription(() =>
    observable<string>((emit) => {
      emit.next("hey!");
    })
  )
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  createContext,
  middleware: cors()
});

const wss = new WebSocketServer({ server, path: '/ws' });

applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext,
});

wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

server.listen(3001);
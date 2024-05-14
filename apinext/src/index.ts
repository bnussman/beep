import { t } from './trpc';
import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { createBunHttpHandler, createBunWSHandler } from 'trpc-bun-adapter';
import { createContext } from './context';
import { octetInputParser } from '@trpc/server/unstable-core-do-not-import';
import { s3 } from './s3';
import cors from 'cors';

const appRouter = t.router({
  user: t.procedure.query(({ ctx }) => {
    return ctx.user;
  }),
  updateProfilePicture: t.procedure.input(octetInputParser).mutation(async ({ input }) => {
    console.log("Input:", input)
    const result = await s3.putObject('photo.png', input)
    console.log("Upload success", result);
    return result.etag;
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


// create server
/* createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    return {};
  },
  onError(opts) {
    console.error('Error', opts.error);
  },
}).listen(3001);
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETET, OPTIONS, POST',
  'Access-Control-Allow-Headers': '*',
};

const websocket = createBunWSHandler({
  router: appRouter,
  onError: console.error,
});

const bunHandler = createBunHttpHandler({
  router: appRouter,
  endpoint: '/trpc',
  createContext,
  batching: {
      enabled: true,
  },
  responseMeta: () => ({
    headers: CORS_HEADERS
  }),
  emitWsUpgrades: false,
});

 Bun.serve({
  async fetch(request, server) {
		const headers = new Headers(CORS_HEADERS);
    
    if (request.method === "OPTIONS") {
			// This is the preflight request. It should only return the CORS headers
			return new Response(null, {
				status: 200,
				headers,
			});
		}

    console.log(request.url)    
    if (request.url.endsWith('/ws') && server.upgrade(request, { data: { req: request } })) {
      return;
    }

    // for (const header of Object.keys(CORS_HEADERS)) {
    //   response?.headers.set(header, CORS_HEADERS[header]);
    // }
    return bunHandler(request, server);
  },
  port: 3001,
  websocket,
})
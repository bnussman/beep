import './utils/instrument';
import type { InferRouterOutputs, InferRouterInputs } from '@orpc/server'
import { createHTTPContext, createWSContext } from "./utils/trpc";
import { userRouter } from "./routers/user";
import { authRouter } from "./routers/auth";
import { reportRouter } from "./routers/report";
import { ratingRouter } from "./routers/rating";
import { carRouter } from "./routers/car";
import { beepRouter } from "./routers/beep";
import { paymentRouter } from "./routers/payment";
import { feedbackRouter } from "./routers/feedback";
import { notificationRouter } from "./routers/notification";
import { redisRouter } from "./routers/redis";
import { riderRouter } from "./routers/rider";
import { beeperRouter } from "./routers/beeper";
import { locationRouter } from "./routers/location";
import { handlePaymentWebook } from "./utils/payments";
import { healthRouter } from "./routers/health";
import { flagsRouter } from "./routers/flags";
import { RPCHandler } from "@orpc/server/fetch";
import { RPCHandler as WSRPCHandler } from '@orpc/server/websocket'
import { CORSPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";
import { RouterClient } from '@orpc/server'
import { getActiveSpan } from '@sentry/bun';

const appRouter = {
  user: userRouter,
  auth: authRouter,
  report: reportRouter,
  rating: ratingRouter,
  car: carRouter,
  beep: beepRouter,
  payment: paymentRouter,
  feedback: feedbackRouter,
  notification: notificationRouter,
  redis: redisRouter,
  rider: riderRouter,
  beeper: beeperRouter,
  location: locationRouter,
  health: healthRouter,
  flags: flagsRouter,
};

interface ClientContext {
  ws?: boolean;
}

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<AppRouter, ClientContext>;
export type RouterInputs = InferRouterInputs<AppRouter>;
export type RouterOutputs = InferRouterOutputs<AppRouter>;

const handler = new RPCHandler(appRouter, {
  plugins: [
    new CORSPlugin({
      origin: "*",
      allowHeaders: ["Content-Type", "Authorization", "Vary", "sentry-trace", "baggage"],
    })
  ],
  interceptors: [
    ({ request, next }) => {
      const span = getActiveSpan();

      request.signal?.addEventListener('abort', () => {
        span?.addEvent('aborted', { reason: String(request.signal?.reason) })
      })

      return next()
    },
    onError((error) => {
      console.error(error)
    }),
  ]
})

const wsHandler = new WSRPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

Bun.serve({
  port: 3001,
  routes: {
    "/payments/webhook": handlePaymentWebook,
  },
  async fetch(request, server) {
    if (server.upgrade(request)) {
      return
    }

    const { response } = await handler.handle(request, {
      context: await createHTTPContext(request)
    })

    if (response) {
      return response;
    }

    return new Response('Not found', { status: 404 })
  },
  websocket: {
    async message(ws, message) {
      await wsHandler.message(ws, message, {
        context: async (request) => {
          return await createWSContext(request)
        },
      })
    },
    async close(ws) {
      await wsHandler.close(ws)
    },
  }
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3001");
console.info("➡️  Listening on ws://0.0.0.0:3001");

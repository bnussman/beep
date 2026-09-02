import './utils/instrument';
import type { InferRouterOutputs, InferRouterInputs } from '@orpc/server'
import { createHTTPContext, createWSContext, errorInterceptor, otelAbortSignalCaptureInterceptor } from "./utils/orpc";
import { userRouter } from "./routers/users/router";
import { authRouter } from "./routers/auth/router";
import { reportRouter } from "./routers/reports/router";
import { ratingRouter } from "./routers/ratings/router";
import { carRouter } from "./routers/cars/router";
import { beepRouter } from "./routers/beeps/router";
import { paymentRouter } from "./routers/payments/router";
import { feedbackRouter } from "./routers/feedback/router";
import { notificationRouter } from "./routers/notifications/router";
import { redisRouter } from "./routers/redis/router";
import { riderRouter } from "./routers/rider/router";
import { beeperRouter } from "./routers/beeper/router";
import { locationRouter } from "./routers/location/router";
import { handlePaymentWebook } from "./utils/payments";
import { healthRouter } from "./routers/health/router";
import { flagsRouter } from "./routers/flags/router";
import { RPCHandler } from "@orpc/server/fetch";
import { RPCHandler as WSRPCHandler } from '@orpc/server/websocket'
import { CORSPlugin } from "@orpc/server/plugins";
import { RouterClient } from '@orpc/server'

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
    errorInterceptor
  ]
})

const wsHandler = new WSRPCHandler(appRouter, {
  interceptors: [
    otelAbortSignalCaptureInterceptor,
    errorInterceptor
  ],
})

Bun.serve({
  port: 3000,
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
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");

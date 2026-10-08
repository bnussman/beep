import './services/instrument';
import { errorInterceptor } from './middleware/errors';
import { otelAbortSignalCaptureInterceptor } from './middleware/otel';
import { userRouter } from "./routes/users";
import { authRouter } from "./routes/auth";
import { reportRouter } from "./routes/reports";
import { ratingRouter } from "./routes/ratings";
import { carRouter } from "./routes/cars";
import { beepRouter } from "./routes/beeps";
import { paymentRouter } from "./routes/payments";
import { feedbackRouter } from "./routes/feedback";
import { notificationRouter } from "./routes/notifications";
import { redisRouter } from "./routes/redis";
import { riderRouter } from "./routes/rider";
import { beeperRouter } from "./routes/beeper";
import { locationRouter } from "./routes/location";
import { handlePaymentWebook } from "./services/payments";
import { healthRouter } from "./routes/health";
import { flagsRouter } from "./routes/flags";
import { RPCHandler } from "@orpc/server/fetch";
import { RPCHandler as WSRPCHandler } from '@orpc/server/websocket'
import { CORSPlugin } from "@orpc/server/plugins";
import { RouterClient } from '@orpc/server'
import { createContext } from './utilities/context';
import type { InferRouterOutputs, InferRouterInputs } from '@orpc/server'

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
      allowHeaders: ["Content-Type", "Authorization", "Vary", "sentry-trace", "baggage", 'Content-Disposition', 'Standard-Server'],
      exposeHeaders: ['Content-Disposition', 'Standard-Server'],
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
      context: createContext
    })

    if (response) {
      return response;
    }

    return new Response('Not found', { status: 404 })
  },
  websocket: {
    async message(ws, message) {
      await wsHandler.message(ws, message, {
        context: createContext
      });
    },
    async close(ws) {
      await wsHandler.close(ws)
    },
  }
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");

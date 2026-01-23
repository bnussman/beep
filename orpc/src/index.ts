import { createContext } from "./utils/trpc";
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
import { RPCHandler } from '@orpc/server/fetch'

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
};

export type AppRouter = typeof appRouter;

const handler = new RPCHandler(appRouter)

Bun.serve({
  port: 3001,
  routes: {
    "/payments/webhook": handlePaymentWebook,
  },
  async fetch(request) {
    const { response } = await handler.handle(request, {
      prefix: '/',
      context: await createContext(request)
    })

    return response ?? new Response('Not found', { status: 404 })
  },
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3001");
console.info("➡️  Listening on ws://0.0.0.0:3001");

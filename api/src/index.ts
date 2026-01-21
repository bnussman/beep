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
import { createContext } from "./utils/trpc";

const appRouter = {
  auth: authRouter,
  user: userRouter,
  // report: reportRouter,
  // rating: ratingRouter,
  // car: carRouter,
  // beep: beepRouter,
  // payment: paymentRouter,
  // feedback: feedbackRouter,
  // notification: notificationRouter,
  // redis: redisRouter,
  // rider: riderRouter,
  // beeper: beeperRouter,
  // location: locationRouter,
  // health: healthRouter,
};

export type AppRouter = typeof appRouter;

const handler = new RPCHandler(appRouter);

// const websocket = createBunWSHandler({
//   router: appRouter,
//   createContext,
//   onError(error) {
//     console.error(error.error);
//     captureException(error.error, {
//       extra: { input: error.input, type: error },
//     });
//   },
// });

Bun.serve({
  routes: {
    "/payments/webhook": handlePaymentWebook,
  },
  async fetch(request) {
    const { matched, response } = await handler.handle(request, {
      context: await createContext(request),
    })
    if (matched) {
    return response;
    }
    return new Response('Not found', { status: 404 })
  },
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");

import { RPCHandler } from '@orpc/server/fetch'
import { RPCHandler as WSRPCHandler } from '@orpc/server/bun-ws'
import { createContext, createWsContext } from "./utils/trpc";
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
import { CORSPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";

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

const handler = new RPCHandler(appRouter, {
  plugins: [
    new CORSPlugin()
  ],
  interceptors: [
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
});

interface WebSocketData {
  token: string | null;
}

Bun.serve({
  port: 3001,
  routes: {
    "/payments/webhook": handlePaymentWebook,
  },
  async fetch(request, server) {
    if (server.upgrade(request, { data: { token: request.headers.get('Sec-WebSocket-Protocol') } })) {
      return
    }

    const { response } = await handler.handle(request, {
      prefix: '/',
      context: await createContext(request)
    })

    return response ?? new Response('Not found', { status: 404 })
  },
  websocket: {
    data: {} as WebSocketData,
    async message(ws, message) {
      console.log(ws, message)
      wsHandler.message(ws, message, {
        context: await createWsContext(ws.data.token),
      })
    },
    close(ws) {
      wsHandler.close(ws)
    },
  },
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3001");
console.info("➡️  Listening on ws://0.0.0.0:3001");

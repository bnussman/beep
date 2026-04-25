import { CORS_HEADERS } from "./utils/cors";
import { makeHandler } from "graphql-ws/use/bun";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";
import { createContext } from "./utils/trpc";

const yoga = createYoga({
  schema,
  context: createContext,
});

Bun.serve({
  port: 3001,
  fetch(req, server) {
    if (req.method === "OPTIONS") {
      return new Response("Departed", { headers: CORS_HEADERS });
    }
    const [path, _search] = req.url.split("?");
    if (!path.endsWith("/graphql")) {
      return new Response("Not Found", { status: 404 });
    }
    if (server.upgrade(req)) {
      return;
    }
    return yoga.fetch(req);
  },
  websocket: makeHandler({ schema }),
});

console.info("🚕 Beep GraphQL Server Started");
console.info("➡️  Listening on http://0.0.0.0:3001");
console.info("➡️  Listening on ws://0.0.0.0:3001");

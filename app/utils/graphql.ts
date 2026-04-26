import {
  Client,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
} from "urql";
import { getAuthToken } from "./trpc";
import { authExchange } from "@urql/exchange-auth";
import { createClient as createWSClient, SubscribePayload } from "graphql-ws";

const wsClient = createWSClient({
  url: "ws://localhost:3001/graphql",
  async connectionParams() {
    const token = await getAuthToken();
    return { token };
  },
  retryAttempts: Infinity,
  async retryWait() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  shouldRetry() {
    return true;
  },
});

export const client = new Client({
  url: "http://localhost:3001/graphql",
  exchanges: [
    authExchange(async (utils) => {
      let token = await getAuthToken();

      return {
        async refreshAuth() {},
        didAuthError(error) {
          return false;
        },
        addAuthToOperation(operation) {
          if (!token) return operation;
          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`,
          });
        },
        // ...
      };
    }),
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(operation) {
        return {
          subscribe: (sink) => {
            const dispose = wsClient.subscribe(
              operation as SubscribePayload,
              sink,
            );
            return {
              unsubscribe: dispose,
            };
          },
        };
      },
    }),
  ],
});

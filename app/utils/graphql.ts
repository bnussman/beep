import { Client, cacheExchange, fetchExchange } from "urql";
import { getAuthToken } from "./trpc";
import { authExchange } from "@urql/exchange-auth";

export const client = new Client({
  url: "http://localhost:3001/graphql",
  exchanges: [
    authExchange(async (utils) => {
      let token = await getAuthToken();

      console.log("Adding auth to operation", token);
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
  ],
});

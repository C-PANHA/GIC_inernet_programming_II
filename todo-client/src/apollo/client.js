import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client/core";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_HASURA_HTTP,
  headers: (() => {
    const headers = {
      "x-hasura-role": import.meta.env.VITE_HASURA_ROLE || "anonymous",
    };
    if (import.meta.env.VITE_HASURA_ADMIN_SECRET) {
      headers["x-hasura-admin-secret"] = import.meta.env.VITE_HASURA_ADMIN_SECRET;
    }
    return headers;
  })(),
});

const wsUrl = import.meta.env.VITE_HASURA_WS;
let link = httpLink;

if (wsUrl) {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: wsUrl,
      connectionParams: async () => ({
          headers: (() => {
            const h = { "x-hasura-role": import.meta.env.VITE_HASURA_ROLE || "anonymous" };
            if (import.meta.env.VITE_HASURA_ADMIN_SECRET) {
              h["x-hasura-admin-secret"] = import.meta.env.VITE_HASURA_ADMIN_SECRET;
            }
            return h;
          })(),
      }),
    }),
  );

  link = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return def.kind === "OperationDefinition" && def.operation === "subscription";
    },
    wsLink,
    httpLink,
  );
}

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

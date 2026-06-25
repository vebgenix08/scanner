import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const endpoint = import.meta.env.VITE_APPSYNC_GRAPHQL_ENDPOINT as string | undefined;
const apiKey = import.meta.env.VITE_APPSYNC_API_KEY as string | undefined;
const authToken = import.meta.env.VITE_APPSYNC_AUTH_TOKEN as string | undefined;

const headers: Record<string, string> = {};

if (apiKey) {
  headers["x-api-key"] = apiKey;
}

if (authToken) {
  headers.Authorization = authToken;
}

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: endpoint ?? "/graphql",
    headers,
  }),
  cache: new InMemoryCache(),
});

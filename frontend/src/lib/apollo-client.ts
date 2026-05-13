import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const graphqlUrl = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL || `${strapiUrl}/graphql`;

export const client = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUrl,
  }),
  cache: new InMemoryCache(),
});

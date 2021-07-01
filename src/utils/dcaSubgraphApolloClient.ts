import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.DCA_GRAPH,
  cache: new InMemoryCache(),
});

export default client;
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloClient from "apollo-client";
import "typeface-roboto";
import { ApolloProvider } from "@apollo/react-hooks";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-boost";

const endpointUrl = process.env.REACT_APP_ENDPOINT_URL;

const httpLink = new HttpLink({
  uri: `https://${endpointUrl}`
});

const wsLink = new WebSocketLink({
  uri: `wss://${endpointUrl}`,
  options: { reconnect: true }
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({ link, cache: new InMemoryCache() });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

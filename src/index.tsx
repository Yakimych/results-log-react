import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import "typeface-roboto";
import { resolvers, typeDefs } from "./resolvers";
import { UserInfo } from "./__generated__/UserInfo";

const endpointUrl = `https://${process.env.REACT_APP_ENDPOINT_URL}`;

const client = new ApolloClient({ uri: endpointUrl, resolvers, typeDefs });

client.cache.writeData<UserInfo>({
  data: {
    userName: null,
    userAge: null
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

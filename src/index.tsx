import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ApolloProvider } from "react-apollo-hooks";
import ApolloClient from "apollo-boost";
import "typeface-roboto";

const client = new ApolloClient({
  uri: process.env.REACT_APP_ENDPOINT_URL
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

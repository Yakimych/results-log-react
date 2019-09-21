import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloClient from "apollo-boost";
import "typeface-roboto";
import { ApolloProvider } from "@apollo/react-hooks";

const endpointUrl = `https://${process.env.REACT_APP_ENDPOINT_URL}`;

const client = new ApolloClient({ uri: endpointUrl });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

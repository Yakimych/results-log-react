import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

const endpointUrl = process.env.REACT_APP_ENDPOINT_URL;

const client = new ApolloClient({
  uri: endpointUrl
});

client
  .query({
    query: gql`
      {
        communities(where: { name: { _eq: "anturahockey" } }) {
          id
          name
          description
        }
      }
    `
  })
  .then(result => console.log(result));

ReactDOM.render(<App />, document.getElementById("root"));

import gql from "graphql-tag";

export const typeDefs = gql`
  extend type query_root {
    userName: String
  }

  extend type mutation_root {
    setUserInfo(userName: String): String
  }
`;

export const resolvers = {};

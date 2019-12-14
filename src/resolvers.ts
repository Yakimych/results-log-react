import gql from "graphql-tag";
import { USER_INFO } from "./localState";

export const typeDefs = gql`
  extend type query_root {
    userName: String
  }

  extend type mutation_root {
    setUserInfo(userName: String): String
  }
`;

// TODO: Typings
export const resolvers = {
  Mutation: {
    setUserInfo: (
      _: any,
      { userName }: { userName: string | null },
      { cache }: { cache: any }
    ) => {
      cache.readQuery({ query: USER_INFO });
      cache.writeQuery({ query: USER_INFO, data: { userName } });
      return userName;
    }
  }
};

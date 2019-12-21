import gql from "graphql-tag";
import { USER_INFO } from "./localState";
import { UserInfo } from "./__generated__/UserInfo";

export const typeDefs = gql`
  extend type query_root {
    userName: String
    userAge: Int
  }

  extend type mutation_root {
    setUserInfo(userName: String, userAge: Int): String
  }
`;

// TODO: Typings
export const resolvers = {
  Mutation: {
    setUserInfo: (_: any, userInfo: UserInfo, { cache }: { cache: any }) => {
      cache.readQuery({ query: USER_INFO });
      cache.writeQuery({
        query: USER_INFO,
        data: { userName: userInfo.userName, userAge: userInfo.userAge }
      });
      return userInfo.userName;
    }
  }
};

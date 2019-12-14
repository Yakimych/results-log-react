import { gql } from "apollo-boost";

export const USER_INFO = gql`
  query UserInfo {
    userName @client
  }
`;

export const SET_USER_NAME = gql`
  mutation SetUserInfo($userName: String) {
    setUserInfo(userName: $userName) @client
  }
`;

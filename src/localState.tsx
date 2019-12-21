import { gql } from "apollo-boost";

export const USER_INFO = gql`
  query UserInfo {
    userName @client
    userAge @client
  }
`;

export const SET_USER_NAME = gql`
  mutation SetUserInfo($userName: String, $userAge: Int) {
    setUserInfo(userName: $userName, userAge: $userAge) @client
  }
`;

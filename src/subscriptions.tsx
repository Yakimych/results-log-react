import { gql } from "apollo-boost";
import { Result } from "./queries";

export const NEW_RESULT_SUBSCRIPTION = gql`
  subscription newResult($communityname: String!) {
    newestResults: newest_result(
      where: { community: { name: { _eq: $communityname } } }
    ) {
      player1 {
        name
      }
      player2 {
        name
      }
      player2goals
      player1goals
      extratime
      date
      id
    }
  }
`;

export type NewestResults = {
  data: { newestResults: readonly Result[] };
};

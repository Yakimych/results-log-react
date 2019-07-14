import { gql } from "apollo-boost";

export const RESULT_COUNT_SUBSCRIPTION = gql`
  subscription resultCount($communityname: name!) {
    results_aggregate(where: { community: { name: { _eq: $communityname } } }) {
      aggregate {
        count
      }
    }
  }
`;

export type ResultCount = {
  results_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

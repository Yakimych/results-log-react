import { gql } from "apollo-boost";

export const ADD_RESULT_MUTATION = gql`
  mutation addResult(
    $communityname: name!
    $player1name: name!
    $player2name: name!
    $date: date!
    $player1goals: Int!
    $player2goals: Int!
    $extratime: Boolean!
  ) {
    insert_results(
      objects: {
        community: {
          data: { name: $communityname }
          on_conflict: {
            constraint: communities_name_key
            update_columns: name
          }
        }
        date: $date
        player1: {
          data: {
            name: $player1name
            community: {
              data: { name: $communityname }
              on_conflict: {
                constraint: communities_name_key
                update_columns: name
              }
            }
          }
          on_conflict: {
            constraint: players_name_communityId_key
            update_columns: name
          }
        }
        player2: {
          data: {
            name: $player2name
            community: {
              data: { name: $communityname }
              on_conflict: {
                constraint: communities_name_key
                update_columns: name
              }
            }
          }
          on_conflict: {
            constraint: players_name_communityId_key
            update_columns: name
          }
        }
        player2goals: $player2goals
        player1goals: $player1goals
        extratime: $extratime
      }
    ) {
      returning {
        id
      }
    }
  }
`;

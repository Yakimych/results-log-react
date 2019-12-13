import { gql } from "apollo-boost";

export const ALL_PLAYERS_QUERY = gql`
  query Players($communityname: String!) {
    players(where: { community: { name: { _eq: $communityname } } }) {
      name
    }
  }
`;

export const ALL_RESULTS_QUERY = gql`
  query AllResults(
    $communityname: String!
    $dateFrom: timestamptz
    $dateTo: timestamptz
  ) {
    results(
      where: {
        community: { name: { _eq: $communityname } }
        date: { _gte: $dateFrom, _lte: $dateTo }
      }
      order_by: { date: desc }
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

export const HEAD_TO_HEAD_QUERY = gql`
  query HeadToHeadResults(
    $communityname: String!
    $player1name: String!
    $player2name: String!
  ) {
    results(
      where: {
        _and: [
          { community: { name: { _eq: $communityname } } }
          {
            _or: [
              { player1: { name: { _eq: $player1name } } }
              { player2: { name: { _eq: $player1name } } }
            ]
          }
          {
            _or: [
              { player1: { name: { _eq: $player2name } } }
              { player2: { name: { _eq: $player2name } } }
            ]
          }
        ]
      }
      order_by: { date: desc }
    ) {
      id
      player1 {
        name
      }
      player1goals
      player2 {
        name
      }
      player2goals
      date
      extratime
    }
  }
`;

export const PLAYER_RESULTS_QUERY = gql`
  query PlayerResults($communityname: String!, $playername: String!) {
    results(
      where: {
        _and: [
          { community: { name: { _eq: $communityname } } }
          {
            _or: [
              { player1: { name: { _eq: $playername } } }
              { player2: { name: { _eq: $playername } } }
            ]
          }
        ]
      }
      order_by: { date: desc }
    ) {
      id
      player1 {
        name
      }
      player1goals
      player2 {
        name
      }
      player2goals
      date
      extratime
    }
  }
`;

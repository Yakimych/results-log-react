import { gql } from "apollo-boost";

export const ALL_PLAYERS_QUERY = gql`
  query getPlayers($communityname: String!) {
    players(where: { community: { name: { _eq: $communityname } } }) {
      name
    }
  }
`;

export type Player = {
  name: string;
};

export type PlayersQueryResponse = {
  players: readonly Player[];
};

export const ALL_RESULTS_QUERY = gql`
  query($communityname: String!) {
    results(
      where: { community: { name: { _eq: $communityname } } }
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

type Result = {
  id: number;
  player1: Player;
  player2: Player;
  player1goals: number;
  player2goals: number;
  date: string;
  extratime: boolean;
};

export type ResultsQueryResponse = {
  results: readonly Result[];
};

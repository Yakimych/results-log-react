import { gql } from "apollo-boost";

export const ALL_PLAYERS_QUERY = gql`
  {
    players {
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
  {
    results(where: { community: { name: { _eq: "anturahockey" } } }) {
      player1 {
        name
      }
      player2 {
        name
      }
      player2goals
      player1goals
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
  date: Date;
};

export type ResultsQueryResponse = {
  results: readonly Result[];
};

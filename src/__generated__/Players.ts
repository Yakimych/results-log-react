/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Players
// ====================================================

export interface Players_players {
  __typename: "players";
  name: string;
}

export interface Players {
  /**
   * fetch data from the table: "players"
   */
  players: Players_players[];
}

export interface PlayersVariables {
  communityname: string;
}

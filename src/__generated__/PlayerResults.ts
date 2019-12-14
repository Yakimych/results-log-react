/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlayerResults
// ====================================================

export interface PlayerResults_results_player1 {
  __typename: "players";
  name: string;
}

export interface PlayerResults_results_player2 {
  __typename: "players";
  name: string;
}

export interface PlayerResults_results {
  __typename: "results";
  id: number;
  /**
   * An object relationship
   */
  player1: PlayerResults_results_player1;
  player1goals: number;
  /**
   * An object relationship
   */
  player2: PlayerResults_results_player2;
  player2goals: number;
  date: any;
  extratime: boolean;
}

export interface PlayerResults {
  /**
   * fetch data from the table: "results"
   */
  results: PlayerResults_results[];
}

export interface PlayerResultsVariables {
  communityname: string;
  playername: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllResults
// ====================================================

export interface AllResults_results_player1 {
  __typename: "players";
  name: string;
}

export interface AllResults_results_player2 {
  __typename: "players";
  name: string;
}

export interface AllResults_results {
  __typename: "results";
  /**
   * An object relationship
   */
  player1: AllResults_results_player1;
  /**
   * An object relationship
   */
  player2: AllResults_results_player2;
  player2goals: number;
  player1goals: number;
  extratime: boolean;
  date: any;
  id: number;
}

export interface AllResults {
  /**
   * fetch data from the table: "results"
   */
  results: AllResults_results[];
}

export interface AllResultsVariables {
  communityname: string;
  dateFrom?: any | null;
  dateTo?: any | null;
}

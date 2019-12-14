/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HeadToHeadResults
// ====================================================

export interface HeadToHeadResults_results_player1 {
  __typename: "players";
  name: string;
}

export interface HeadToHeadResults_results_player2 {
  __typename: "players";
  name: string;
}

export interface HeadToHeadResults_results {
  __typename: "results";
  id: number;
  /**
   * An object relationship
   */
  player1: HeadToHeadResults_results_player1;
  player1goals: number;
  /**
   * An object relationship
   */
  player2: HeadToHeadResults_results_player2;
  player2goals: number;
  date: any;
  extratime: boolean;
}

export interface HeadToHeadResults {
  /**
   * fetch data from the table: "results"
   */
  results: HeadToHeadResults_results[];
}

export interface HeadToHeadResultsVariables {
  communityname: string;
  player1name: string;
  player2name: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddResult
// ====================================================

export interface AddResult_insert_results_returning {
  __typename: "results";
  id: number;
}

export interface AddResult_insert_results {
  __typename: "results_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: AddResult_insert_results_returning[];
}

export interface AddResult {
  /**
   * insert data into the table: "results"
   */
  insert_results: AddResult_insert_results | null;
}

export interface AddResultVariables {
  communityname: string;
  player1name: string;
  player2name: string;
  date: any;
  player1goals: number;
  player2goals: number;
  extratime: boolean;
}

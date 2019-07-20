import React from "react";
import { RouteComponentProps } from "@reach/router";
import { CommunityNameProps } from "./RouteProps";
import { useQuery } from "react-apollo-hooks";
import { ResultsQueryResponse, HEAD_TO_HEAD_QUERY } from "./queries";
import { ResultsTable } from "./ResultsTable";

type Props = {
  player1name: string;
  player2name: string;
} & CommunityNameProps;

export const HeadToHead: React.FC<RouteComponentProps<Props>> = ({
  player1name,
  player2name,
  communityname
}) => {
  const headToHeadQuery = useQuery<ResultsQueryResponse>(HEAD_TO_HEAD_QUERY, {
    variables: { communityname, player1name, player2name }
  });

  if (headToHeadQuery.loading) return <p>Loading...</p>;
  if (headToHeadQuery.error) return <p>Error!</p>;
  if (headToHeadQuery.data === undefined) return <p>Data is undefined</p>;

  return (
    <>
      <h1>Head to Head Record</h1>
      <div>{player1name}</div>
      <div>{player2name}</div>
      <ResultsTable results={headToHeadQuery.data.results} />
    </>
  );
};

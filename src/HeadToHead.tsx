import React from "react";
import { RouteComponentProps } from "@reach/router";
import { CommunityNameProps } from "./RouteProps";
import { useQuery } from "react-apollo-hooks";
import { ResultsQueryResponse, HEAD_TO_HEAD_QUERY } from "./queries";
import { ResultsTable } from "./ResultsTable";
import { Typography, Box } from "@material-ui/core";

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
  if (!headToHeadQuery.data || !communityname) return <p>Data is undefined</p>;

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h5">Head to Head</Typography>
        <Typography variant="h4">
          {player1name} vs {player2name}
        </Typography>
      </Box>
      <ResultsTable
        communityname={communityname}
        results={headToHeadQuery.data.results}
      />
    </>
  );
};

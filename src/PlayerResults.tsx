import React from "react";
import { RouteComponentProps } from "@reach/router";
import { CommunityNameProps } from "./RouteProps";
import { useQuery } from "react-apollo-hooks";
import { PLAYER_RESULTS_QUERY } from "./queries";
import { ResultsTable } from "./ResultsTable";
import { Typography, Box } from "@material-ui/core";

type Props = {
  playername: string;
} & CommunityNameProps;

export const PlayerResults: React.FC<RouteComponentProps<Props>> = ({
  playername,
  communityname
}) => {
  const playerResultsQuery = useQuery(PLAYER_RESULTS_QUERY, {
    variables: { communityname, playername }
  });

  if (playerResultsQuery.loading) return <p>Loading...</p>;
  if (playerResultsQuery.error) return <p>Error!</p>;
  if (!playerResultsQuery.data || !communityname || !playername)
    return <p>Data is undefined</p>;

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h5">Player results</Typography>
        <Typography variant="h4">{playername}</Typography>
      </Box>
      <ResultsTable
        results={playerResultsQuery.data.results}
        communityname={communityname}
      />
    </>
  );
};

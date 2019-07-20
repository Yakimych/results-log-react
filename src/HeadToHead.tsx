import React from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { CommunityNameProps } from "./RouteProps";
import { useQuery } from "react-apollo-hooks";
import { ResultsQueryResponse, HEAD_TO_HEAD_QUERY } from "./queries";
import { ResultsTable } from "./ResultsTable";
import { Typography, Box } from "@material-ui/core";
import { getHeadToHeadStats } from "./utils";

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
  if (!headToHeadQuery.data || !communityname || !player1name || !player2name)
    return <p>Data is undefined</p>;

  const stats = getHeadToHeadStats(
    headToHeadQuery.data.results,
    player1name,
    player2name
  );

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h5">Head to Head</Typography>
        <Typography variant="h4">
          {player1name} vs {player2name}
        </Typography>
        <div>
          <span className="stats-player-goals">({stats.player1Goals})</span>{" "}
          <span className="stats-player-wins">
            {stats.player1Wins} - {stats.player2Wins}
          </span>{" "}
          <span className="stats-player-goals">({stats.player2Goals})</span>
        </div>
      </Box>
      <ResultsTable
        communityname={communityname}
        results={headToHeadQuery.data.results}
      />
      <Link to={`/${communityname}`}>Back to full result list</Link>
    </>
  );
};

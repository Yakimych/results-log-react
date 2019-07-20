import React from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { CommunityNameProps } from "./RouteProps";
import { useQuery } from "react-apollo-hooks";
import { ResultsQueryResponse, HEAD_TO_HEAD_QUERY } from "./queries";
import { ResultsTable } from "./ResultsTable";
import { Typography, Box } from "@material-ui/core";
import { getPlayerStats } from "./utils";
import ReactMinimalPieChart from "react-minimal-pie-chart";

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

  const stats = getPlayerStats(headToHeadQuery.data.results, player1name);

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h5">Head to Head</Typography>
        <Typography variant="h4">
          {player1name} vs {player2name}
        </Typography>
        <div>
          <span className="stats-player-goals">({stats.goalsScored})</span>{" "}
          <span className="stats-player-wins">
            {stats.numberOfWins} - {stats.numberOfLosses}
          </span>{" "}
          <span className="stats-player-goals">({stats.goalsConceded})</span>
        </div>
        <ReactMinimalPieChart
          style={{ height: "100px", marginBottom: "10px" }}
          data={[
            {
              title: player1name,
              value: stats.numberOfWins,
              color: "#00cc00"
            },
            {
              title: player2name,
              value: stats.numberOfLosses,
              color: "#FF2200"
            }
          ]}
          animate
          lineWidth={80}
          label
          labelStyle={{
            fontSize: "20px",
            fill: "#ffffff"
          }}
        />
      </Box>
      <ResultsTable
        communityname={communityname}
        results={headToHeadQuery.data.results}
      />
      <Link to={`/${communityname}`}>Back to full result list</Link>
    </>
  );
};

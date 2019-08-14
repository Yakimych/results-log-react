import React from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { CommunityNameProps } from "./RouteProps";
import { useQuery } from "react-apollo-hooks";
import { PLAYER_RESULTS_QUERY } from "./queries";
import { ResultsTable } from "./ResultsTable";
import { Typography, Box, CircularProgress } from "@material-ui/core";
import { getPlayerStats } from "./utils";
import { StreakView } from "./StreakView";

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

  if (playerResultsQuery.loading) return <CircularProgress />;
  if (playerResultsQuery.error) return <p>Error!</p>;
  if (!playerResultsQuery.data || !communityname || !playername)
    return <p>Data is undefined</p>;

  const playerStats = getPlayerStats(
    playerResultsQuery.data.results,
    playername
  );

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h5">Player results</Typography>
        <Typography variant="h4">{playername}</Typography>
        <Typography>Total wins: {playerStats.numberOfWins}</Typography>
        <Typography>Total losses: {playerStats.numberOfLosses}</Typography>
        <Typography>Total goals scored: {playerStats.goalsScored}</Typography>
        <Typography>
          Total goals conceded: {playerStats.goalsConceded}
        </Typography>
        {playerStats.streaks.longestStreak !== null ? (
          <StreakView
            streak={playerStats.streaks.longestStreak}
            streakName="Longest winning streak"
          />
        ) : null}
        {playerStats.streaks.currentStreak !== null ? (
          <StreakView
            streak={playerStats.streaks.currentStreak}
            streakName="Ongoing winning streak"
          />
        ) : null}
      </Box>
      {/* TODO: Highlight whole rows with wins and losses (red/green) */}
      <ResultsTable
        results={playerResultsQuery.data.results}
        communityname={communityname}
      />
      <Link to={`/${communityname}`}>Back to Start Page</Link>
    </>
  );
};

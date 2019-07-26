import React from "react";
import { ResultsQueryResponse, ALL_RESULTS_QUERY } from "./queries";
import { CommunityNameProps } from "./RouteProps";
import {
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
import { useQuery } from "react-apollo-hooks";
import { getLeaderboard, MIN_MATCHES } from "./leaderboardUtils";
import { Link } from "@reach/router";

type Props = {
  dateFrom?: Date;
  dateTo?: Date;
} & CommunityNameProps;

// TODO: Reuse styles
const containerStyle: React.CSSProperties = {
  width: 550
};

const goalsStyle: React.CSSProperties = {
  width: 20,
  paddingLeft: 10,
  paddingRight: 0
};

const playerLinkStyle = {
  textDecoration: "none",
  color: "rgba(0, 0, 0, 0.87)"
};

export const WeeklyLeaderboard: React.FC<Props> = ({
  communityname,
  dateFrom,
  dateTo
}) => {
  const allResultsQuery = useQuery<ResultsQueryResponse>(ALL_RESULTS_QUERY, {
    variables: { communityname, dateFrom, dateTo }
  });

  if (allResultsQuery.loading) return <CircularProgress />;
  if (allResultsQuery.error) return <p>Error!</p>;
  if (allResultsQuery.data === undefined) return <p>Data is undefined</p>;

  const results = allResultsQuery.data.results;
  const leaderboardRows = getLeaderboard(results);

  return (
    <>
      <Paper style={containerStyle}>
        <Table style={containerStyle} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="right">Player</TableCell>
              <TableCell style={goalsStyle}>TM</TableCell>
              <TableCell style={goalsStyle}>W/M</TableCell>
              <TableCell style={goalsStyle}>W</TableCell>
              <TableCell style={goalsStyle}>L</TableCell>
              <TableCell style={goalsStyle}>GS</TableCell>
              <TableCell style={goalsStyle}>GC</TableCell>
              <TableCell style={goalsStyle}>GD</TableCell>
              <TableCell style={goalsStyle}>G/M</TableCell>
              <TableCell style={goalsStyle}>GC/M</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardRows.map(r => {
              const totalMatches = r.matchesWon + r.matchesLost;

              if (totalMatches < MIN_MATCHES) return null;

              const goalsScoredPerMatch = r.goalsScored / totalMatches;
              const goalsConcededPerMatch = r.goalsConceded / totalMatches;
              const matchesWonPerPlayed = Math.round(
                (r.matchesWon / totalMatches) * 100
              );
              const goalDiff = r.goalsScored - r.goalsConceded;

              return (
                <TableRow key={r.playerName}>
                  <TableCell align="right">
                    <Link
                      to={`/${communityname}/${r.playerName}`}
                      style={playerLinkStyle}
                    >
                      {r.playerName}
                    </Link>
                  </TableCell>
                  <TableCell style={goalsStyle}>{totalMatches}</TableCell>
                  <TableCell style={goalsStyle}>
                    {matchesWonPerPlayed}%
                  </TableCell>
                  <TableCell style={goalsStyle}>{r.matchesWon}</TableCell>
                  <TableCell style={goalsStyle}>{r.matchesLost}</TableCell>
                  <TableCell style={goalsStyle}>{r.goalsScored}</TableCell>
                  <TableCell style={goalsStyle}>{r.goalsConceded}</TableCell>
                  <TableCell style={goalsStyle}>{goalDiff}</TableCell>
                  <TableCell style={goalsStyle}>
                    {goalsScoredPerMatch.toFixed(2)}
                  </TableCell>
                  <TableCell style={goalsStyle}>
                    {goalsConcededPerMatch.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

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
  TableBody,
  TableSortLabel
} from "@material-ui/core";
import { useQuery } from "react-apollo-hooks";
import {
  getLeaderboard,
  MIN_MATCHES,
  ExtendedLeaderboardRow
} from "./leaderboardUtils";
import { Link } from "@reach/router";

type Props = {
  dateFrom?: Date;
  dateTo?: Date;
} & CommunityNameProps;

type SortDirection = "asc" | "desc";

enum ColumnType {
  WinsPerMatch,
  MatchesWon,
  MatchesLost,
  GoalsScored,
  GoalsConceded,
  GoalDiff,
  GoalsScoredPerMatch,
  GoalsConcededPerMatch
}

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

const getInternalSortFunc = (sortBy: ColumnType) => {
  switch (sortBy) {
    case ColumnType.WinsPerMatch:
      return (row: ExtendedLeaderboardRow) => row.matchesWonPerPlayed;
    case ColumnType.MatchesWon:
      return (row: ExtendedLeaderboardRow) => row.matchesWon;
    case ColumnType.MatchesLost:
      return (row: ExtendedLeaderboardRow) => row.matchesLost;
    case ColumnType.GoalsScored:
      return (row: ExtendedLeaderboardRow) => row.goalsScored;
    case ColumnType.GoalsConceded:
      return (row: ExtendedLeaderboardRow) => row.goalsConceded;
    case ColumnType.GoalDiff:
      return (row: ExtendedLeaderboardRow) => row.goalDiff;
    case ColumnType.GoalsScoredPerMatch:
      return (row: ExtendedLeaderboardRow) => row.goalsScoredPerMatch;
    case ColumnType.GoalsConcededPerMatch:
      return (row: ExtendedLeaderboardRow) => row.goalsConcededPerMatch;
  }
};

const getSortFunc = (
  sortFunc: (row: ExtendedLeaderboardRow) => number,
  sortDirection: SortDirection
) => (row1: ExtendedLeaderboardRow, row2: ExtendedLeaderboardRow) => {
  if (sortFunc(row1) > sortFunc(row2)) {
    return sortDirection === "asc" ? 1 : -1;
  }
  if (sortFunc(row1) < sortFunc(row2)) {
    return sortDirection === "asc" ? -1 : 1;
  }
  return 0;
};

export const WeeklyLeaderboard: React.FC<Props> = ({
  communityname,
  dateFrom,
  dateTo
}) => {
  const allResultsQuery = useQuery<ResultsQueryResponse>(ALL_RESULTS_QUERY, {
    variables: { communityname, dateFrom, dateTo }
  });

  const [sortBy, setSortBy] = React.useState<ColumnType>(
    ColumnType.WinsPerMatch
  );
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(
    "desc"
  );

  if (allResultsQuery.loading) return <CircularProgress />;
  if (allResultsQuery.error) return <p>Error!</p>;
  if (allResultsQuery.data === undefined) return <p>Data is undefined</p>;

  // TODO: Clean this up
  const internalSortFunc = getInternalSortFunc(sortBy);
  const sortFunc = getSortFunc(internalSortFunc, sortDirection);

  const results = allResultsQuery.data.results;
  const leaderboardRows = getLeaderboard(results)
    .filter(r => r.matchesWon + r.matchesLost >= MIN_MATCHES)
    .sort(sortFunc);

  const requestSort = (columnType: ColumnType) => {
    setSortBy(columnType);
    setSortDirection(currentDirection =>
      currentDirection === "asc" ? "desc" : "asc"
    );
  };

  return (
    <>
      <Paper style={containerStyle}>
        <Table style={containerStyle} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="right">Player</TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === ColumnType.WinsPerMatch}
                  direction={sortDirection}
                  onClick={() => requestSort(ColumnType.WinsPerMatch)}
                >
                  W%
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === ColumnType.MatchesWon}
                  direction={sortDirection}
                  onClick={() => requestSort(ColumnType.MatchesWon)}
                >
                  W
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === ColumnType.MatchesLost}
                  direction={sortDirection}
                  onClick={() => requestSort(ColumnType.MatchesLost)}
                >
                  L
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === ColumnType.GoalsScored}
                  direction={sortDirection}
                  onClick={() => requestSort(ColumnType.GoalsScored)}
                >
                  GS
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === ColumnType.GoalsConceded}
                  direction={sortDirection}
                  onClick={() => requestSort(ColumnType.GoalsConceded)}
                >
                  GC
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === ColumnType.GoalDiff}
                  direction={sortDirection}
                  onClick={() => requestSort(ColumnType.GoalDiff)}
                >
                  +/-
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === ColumnType.GoalsScoredPerMatch}
                  direction={sortDirection}
                  onClick={() => requestSort(ColumnType.GoalsScoredPerMatch)}
                >
                  G/M
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === ColumnType.GoalsConcededPerMatch}
                  direction={sortDirection}
                  onClick={() => requestSort(ColumnType.GoalsConcededPerMatch)}
                >
                  C/M
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardRows.map(r => {
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
                  <TableCell style={goalsStyle}>
                    {r.matchesWonPerPlayed}%
                  </TableCell>
                  <TableCell style={goalsStyle}>{r.matchesWon}</TableCell>
                  <TableCell style={goalsStyle}>{r.matchesLost}</TableCell>
                  <TableCell style={goalsStyle}>{r.goalsScored}</TableCell>
                  <TableCell style={goalsStyle}>{r.goalsConceded}</TableCell>
                  <TableCell style={goalsStyle}>
                    {r.goalDiff > 0 ? "+" : ""}
                    {r.goalDiff}
                  </TableCell>
                  <TableCell style={goalsStyle}>
                    {r.goalsScoredPerMatch.toFixed(1)}
                  </TableCell>
                  <TableCell style={goalsStyle}>
                    {r.goalsConcededPerMatch.toFixed(1)}
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

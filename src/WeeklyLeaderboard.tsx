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
    case "WINS_PER_MATCH":
      return (row: ExtendedLeaderboardRow) => row.matchesWonPerPlayed;
    case "WINS":
      return (row: ExtendedLeaderboardRow) => row.matchesWon;
    case "LOSSES":
      return (row: ExtendedLeaderboardRow) => row.matchesLost;
    case "GOALS_SCORED":
      return (row: ExtendedLeaderboardRow) => row.goalsScored;
    case "GOALS_CONCEDED":
      return (row: ExtendedLeaderboardRow) => row.goalsConceded;
    case "GOAL_DIFF":
      return (row: ExtendedLeaderboardRow) => row.goalDiff;
    case "GOALS_PER_MATCH":
      return (row: ExtendedLeaderboardRow) => row.goalsScoredPerMatch;
    case "GOALS_CONCEDED_PER_MATCH":
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

type SortDirection = "asc" | "desc";
type ColumnType =
  | "WINS_PER_MATCH"
  | "WINS"
  | "LOSSES"
  | "GOALS_SCORED"
  | "GOALS_CONCEDED"
  | "GOAL_DIFF"
  | "GOALS_PER_MATCH"
  | "GOALS_CONCEDED_PER_MATCH";

export const WeeklyLeaderboard: React.FC<Props> = ({
  communityname,
  dateFrom,
  dateTo
}) => {
  const allResultsQuery = useQuery<ResultsQueryResponse>(ALL_RESULTS_QUERY, {
    variables: { communityname, dateFrom, dateTo }
  });

  const [sortBy, setSortBy] = React.useState<ColumnType>("WINS_PER_MATCH");
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
                  active={sortBy === "WINS_PER_MATCH"}
                  direction={sortDirection}
                  onClick={() => requestSort("WINS_PER_MATCH")}
                >
                  W%
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === "WINS"}
                  direction={sortDirection}
                  onClick={() => requestSort("WINS")}
                >
                  W
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === "LOSSES"}
                  direction={sortDirection}
                  onClick={() => requestSort("LOSSES")}
                >
                  L
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === "GOALS_SCORED"}
                  direction={sortDirection}
                  onClick={() => requestSort("GOALS_SCORED")}
                >
                  GS
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === "GOALS_CONCEDED"}
                  direction={sortDirection}
                  onClick={() => requestSort("GOALS_CONCEDED")}
                >
                  GC
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === "GOAL_DIFF"}
                  direction={sortDirection}
                  onClick={() => requestSort("GOAL_DIFF")}
                >
                  +/-
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === "GOALS_PER_MATCH"}
                  direction={sortDirection}
                  onClick={() => requestSort("GOALS_PER_MATCH")}
                >
                  G/M
                </TableSortLabel>
              </TableCell>
              <TableCell style={goalsStyle}>
                <TableSortLabel
                  active={sortBy === "GOALS_CONCEDED_PER_MATCH"}
                  direction={sortDirection}
                  onClick={() => requestSort("GOALS_CONCEDED_PER_MATCH")}
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

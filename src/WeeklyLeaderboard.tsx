import React from "react";
import { ResultsQueryResponse, ALL_RESULTS_QUERY } from "./queries";
import { CommunityNameProps } from "./RouteProps";
import { useQuery } from "@apollo/react-hooks";
import {
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Typography
} from "@material-ui/core";
import {
  getLeaderboard,
  MIN_MATCHES_FOR_STATS,
  ExtendedLeaderboardRow
} from "./leaderboardUtils";
import { Link } from "@reach/router";
import { containerStyle, numberCellStyle, playerLinkStyle } from "./styles";
import { NEW_RESULT_SUBSCRIPTION, NewestResults } from "./subscriptions";

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

const getValueToCompareFunc = (sortBy: ColumnType) => {
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

const getSortFunc = (sortBy: ColumnType, sortDirection: SortDirection) => (
  row1: ExtendedLeaderboardRow,
  row2: ExtendedLeaderboardRow
) => {
  const getValueToCompare = getValueToCompareFunc(sortBy);

  const valueFromRow1ToCompare = getValueToCompare(row1);
  const valueFromRow2ToCompare = getValueToCompare(row2);

  if (valueFromRow1ToCompare > valueFromRow2ToCompare) {
    return sortDirection === "asc" ? 1 : -1;
  }
  if (valueFromRow1ToCompare < valueFromRow2ToCompare) {
    return sortDirection === "asc" ? -1 : 1;
  }
  return 0;
};

export const WeeklyLeaderboard: React.FC<Props> = ({
  communityname,
  dateFrom,
  dateTo
}) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    ResultsQueryResponse
  >(ALL_RESULTS_QUERY, {
    variables: { communityname, dateFrom, dateTo }
  });

  React.useEffect(() => {
    subscribeToMore({
      document: NEW_RESULT_SUBSCRIPTION,
      variables: { communityname },
      updateQuery: (
        prev,
        { subscriptionData }: { subscriptionData: NewestResults }
      ) => {
        const newestResult = subscriptionData.data.newest_result[0];
        const alreadyInList =
          newestResult && prev.results.filter(r => r.id === newestResult.id)[0];
        return {
          results: [...(alreadyInList ? [] : [newestResult]), ...prev.results]
        };
      }
    });
  }, [subscribeToMore, communityname]);

  const [sortBy, setSortBy] = React.useState<ColumnType>(
    ColumnType.WinsPerMatch
  );
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(
    "desc"
  );

  if (loading) return <CircularProgress />;
  if (error) return <p>Error!</p>;
  if (data === undefined) return <p>Data is undefined</p>;

  const results = data.results;
  const leaderboardRows = getLeaderboard(results)
    .filter(r => r.matchesWon + r.matchesLost >= MIN_MATCHES_FOR_STATS)
    .sort(getSortFunc(sortBy, sortDirection));

  const requestSort = (columnType: ColumnType) => {
    setSortBy(columnType);
    setSortDirection(currentDirection =>
      currentDirection === "asc" ? "desc" : "asc"
    );
  };

  return (
    <>
      {leaderboardRows.length === 0 ? null : (
        <Paper style={containerStyle}>
          <Typography variant="h6">Weekly stats</Typography>
          <Table style={containerStyle} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="right">Player</TableCell>
                <TableCell style={numberCellStyle} title="Win Percentage">
                  <TableSortLabel
                    active={sortBy === ColumnType.WinsPerMatch}
                    direction={sortDirection}
                    onClick={() => requestSort(ColumnType.WinsPerMatch)}
                  >
                    W%
                  </TableSortLabel>
                </TableCell>
                <TableCell style={numberCellStyle} title="Number of wins">
                  <TableSortLabel
                    active={sortBy === ColumnType.MatchesWon}
                    direction={sortDirection}
                    onClick={() => requestSort(ColumnType.MatchesWon)}
                  >
                    W
                  </TableSortLabel>
                </TableCell>
                <TableCell style={numberCellStyle} title="Number of losses">
                  <TableSortLabel
                    active={sortBy === ColumnType.MatchesLost}
                    direction={sortDirection}
                    onClick={() => requestSort(ColumnType.MatchesLost)}
                  >
                    L
                  </TableSortLabel>
                </TableCell>
                <TableCell style={numberCellStyle} title="Goals scored">
                  <TableSortLabel
                    active={sortBy === ColumnType.GoalsScored}
                    direction={sortDirection}
                    onClick={() => requestSort(ColumnType.GoalsScored)}
                  >
                    GS
                  </TableSortLabel>
                </TableCell>
                <TableCell style={numberCellStyle} title="Goals conceded">
                  <TableSortLabel
                    active={sortBy === ColumnType.GoalsConceded}
                    direction={sortDirection}
                    onClick={() => requestSort(ColumnType.GoalsConceded)}
                  >
                    GC
                  </TableSortLabel>
                </TableCell>
                <TableCell style={numberCellStyle} title="Goal difference">
                  <TableSortLabel
                    active={sortBy === ColumnType.GoalDiff}
                    direction={sortDirection}
                    onClick={() => requestSort(ColumnType.GoalDiff)}
                  >
                    +/-
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={numberCellStyle}
                  title="Goals scored per match"
                >
                  <TableSortLabel
                    active={sortBy === ColumnType.GoalsScoredPerMatch}
                    direction={sortDirection}
                    onClick={() => requestSort(ColumnType.GoalsScoredPerMatch)}
                  >
                    G/M
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={numberCellStyle}
                  title="Goals conceded per match"
                >
                  <TableSortLabel
                    active={sortBy === ColumnType.GoalsConcededPerMatch}
                    direction={sortDirection}
                    onClick={() =>
                      requestSort(ColumnType.GoalsConcededPerMatch)
                    }
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
                    <TableCell style={numberCellStyle}>
                      {r.matchesWonPerPlayed}%
                    </TableCell>
                    <TableCell style={numberCellStyle}>
                      {r.matchesWon}
                    </TableCell>
                    <TableCell style={numberCellStyle}>
                      {r.matchesLost}
                    </TableCell>
                    <TableCell style={numberCellStyle}>
                      {r.goalsScored}
                    </TableCell>
                    <TableCell style={numberCellStyle}>
                      {r.goalsConceded}
                    </TableCell>
                    <TableCell style={numberCellStyle}>
                      {r.goalDiff > 0 ? "+" : ""}
                      {r.goalDiff}
                    </TableCell>
                    <TableCell style={numberCellStyle}>
                      {r.goalsScoredPerMatch.toFixed(1)}
                    </TableCell>
                    <TableCell style={numberCellStyle}>
                      {r.goalsConcededPerMatch.toFixed(1)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </>
  );
};

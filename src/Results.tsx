import React from "react";
import { useQuery, useSubscription } from "react-apollo-hooks";
import { ALL_RESULTS_QUERY, ResultsQueryResponse, Result } from "./queries";
import Table from "@material-ui/core/Table";
import {
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Badge,
  Button
} from "@material-ui/core";
import { formatDate } from "./utils";
import { ResultCount, RESULT_COUNT_SUBSCRIPTION } from "./subscriptions";
import { CommunityNameProps } from "./RouteProps";

const getPlayerStyle = (isWinningPlayer: boolean): React.CSSProperties => ({
  fontWeight: isWinningPlayer ? "bold" : "normal"
});

const goalsStyle: React.CSSProperties = {
  width: 20,
  paddingLeft: 10,
  paddingRight: 0
};

const colonStyle: React.CSSProperties = {
  width: 5,
  paddingLeft: 0,
  paddingRight: 0
};

const dateStyle: React.CSSProperties = {
  width: 100
};

const extraTimeStyle: React.CSSProperties = {
  width: 20
};

const containerStyle: React.CSSProperties = {
  width: 650
};

export const Results: React.FC<CommunityNameProps> = ({ communityname }) => {
  const lastFetchedResultsRef = React.useRef<ReadonlyArray<Result> | null>(
    null
  );

  const [newResults, setNewResults] = React.useState<ReadonlyArray<Result>>([]);

  const allResultsQuery = useQuery<ResultsQueryResponse>(ALL_RESULTS_QUERY, {
    variables: { communityname }
  });

  const resultCountSubscription = useSubscription<ResultCount>(
    RESULT_COUNT_SUBSCRIPTION,
    { variables: { communityname } }
  );

  React.useEffect(() => {
    const lastFetchedResult = lastFetchedResultsRef.current;
    const queryData = allResultsQuery.data;
    if (queryData) {
      if (lastFetchedResult !== null) {
        setNewResults(
          queryData.results.filter(r => lastFetchedResult.indexOf(r) < 0)
        );
      }
      lastFetchedResultsRef.current = queryData.results;
    }
  }, [allResultsQuery.data]);

  if (allResultsQuery.loading) return <p>Loading...</p>;
  if (allResultsQuery.error) return <p>Error!</p>;
  if (allResultsQuery.data === undefined) return <p>Data is undefined</p>;

  const getNewResultsButton = (fetchedResultsCount: number) => {
    if (
      resultCountSubscription.loading ||
      resultCountSubscription.error ||
      resultCountSubscription.data === undefined
    )
      return null;

    const newResultsCount =
      resultCountSubscription.data.results_aggregate.aggregate.count -
      fetchedResultsCount;

    return newResultsCount > 0 ? (
      <Badge color="primary" badgeContent={newResultsCount.toString()}>
        <Button variant="contained" onClick={_ => allResultsQuery.refetch()}>
          Refresh Results
        </Button>
      </Badge>
    ) : null;
  };

  return (
    <>
      {getNewResultsButton(allResultsQuery.data.results.length)}
      <Paper style={containerStyle}>
        <Table style={containerStyle} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="right">Player1</TableCell>
              <TableCell style={goalsStyle}>G1</TableCell>
              <TableCell style={colonStyle} />
              <TableCell style={goalsStyle}>G2</TableCell>
              <TableCell>Player2</TableCell>
              <TableCell style={extraTimeStyle} align="right">
                E
              </TableCell>
              <TableCell style={dateStyle}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allResultsQuery.data.results.map(r => {
              const player1Won = r.player1goals > r.player2goals;
              const player2Won = !player1Won;
              const formattedDate = formatDate(new Date(r.date));

              return (
                <TableRow
                  key={r.id}
                  className={newResults.indexOf(r) > -1 ? "highlighted" : ""}
                >
                  <TableCell style={getPlayerStyle(player1Won)} align="right">
                    {r.player1.name}
                  </TableCell>
                  <TableCell style={goalsStyle}>{r.player1goals}</TableCell>
                  <TableCell style={colonStyle}> : </TableCell>
                  <TableCell style={goalsStyle}>{r.player2goals}</TableCell>
                  <TableCell style={getPlayerStyle(player2Won)}>
                    {r.player2.name}
                  </TableCell>
                  <TableCell align="right">{r.extratime ? "X" : ""}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

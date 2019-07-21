import React from "react";
import { useQuery, useSubscription } from "react-apollo-hooks";
import { ALL_RESULTS_QUERY, ResultsQueryResponse, Result } from "./queries";
import { Badge, Button } from "@material-ui/core";
import { ResultCount, RESULT_COUNT_SUBSCRIPTION } from "./subscriptions";
import { CommunityNameProps } from "./RouteProps";
import { ResultsTable } from "./ResultsTable";

export const Results: React.FC<CommunityNameProps> = ({ communityname }) => {
  const lastFetchedResultsRef = React.useRef<readonly Result[] | null>(null);

  const [newResults, setNewResults] = React.useState<readonly Result[]>([]);

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
      <ResultsTable
        communityname={communityname}
        results={allResultsQuery.data.results}
        newResults={newResults}
      />
    </>
  );
};

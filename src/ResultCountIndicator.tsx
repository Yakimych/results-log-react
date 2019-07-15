import * as React from "react";
import { useSubscription, useQuery } from "react-apollo-hooks";
import { RESULT_COUNT_SUBSCRIPTION, ResultCount } from "./subscriptions";
import { ResultsQueryResponse, ALL_RESULTS_QUERY } from "./queries";
import { Button, Badge } from "@material-ui/core";

const communityname = process.env.REACT_APP_COMMUNITY_NAME;

export const ResultCountIndicator: React.FC = () => {
  const allResultsQuery = useQuery<ResultsQueryResponse>(ALL_RESULTS_QUERY, {
    variables: { communityname: process.env.REACT_APP_COMMUNITY_NAME }
  });

  const resultCountSubscription = useSubscription<ResultCount>(
    RESULT_COUNT_SUBSCRIPTION,
    { variables: { communityname } }
  );

  if (allResultsQuery.loading || resultCountSubscription.loading)
    return <div>Loading...</div>;
  if (allResultsQuery.error)
    return <div>Error: {allResultsQuery.error.message}</div>;
  if (resultCountSubscription.error)
    return <div>Error: {resultCountSubscription.error.message}</div>;
  if (
    allResultsQuery.data === undefined ||
    resultCountSubscription.data === undefined
  ) {
    return <div>Data is undefined</div>;
  }

  const newResults =
    resultCountSubscription.data.results_aggregate.aggregate.count -
    allResultsQuery.data.results.length;

  return newResults > 0 ? (
    <>
      <Badge color="primary" badgeContent={newResults.toString()}>
        <Button variant="contained" onClick={_ => allResultsQuery.refetch()}>
          Refresh Results
        </Button>
      </Badge>
    </>
  ) : null;
};

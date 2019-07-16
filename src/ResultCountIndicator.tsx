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

  if (
    allResultsQuery.loading ||
    resultCountSubscription.loading ||
    allResultsQuery.error ||
    resultCountSubscription.error ||
    allResultsQuery.data === undefined ||
    resultCountSubscription.data === undefined
  )
    return null;

  const newResultsCount =
    resultCountSubscription.data.results_aggregate.aggregate.count -
    allResultsQuery.data.results.length;

  return newResultsCount > 0 ? (
    <Badge color="primary" badgeContent={newResultsCount.toString()}>
      <Button variant="contained" onClick={_ => allResultsQuery.refetch()}>
        Refresh Results
      </Button>
    </Badge>
  ) : null;
};

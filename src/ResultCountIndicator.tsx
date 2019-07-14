import * as React from "react";
import { useSubscription } from "react-apollo-hooks";
import { RESULT_COUNT_SUBSCRIPTION, ResultCount } from "./subscriptions";

const communityname = process.env.REACT_APP_COMMUNITY_NAME;

export const ResultCountIndicator: React.FC = () => {
  const { data, error, loading } = useSubscription<ResultCount>(
    RESULT_COUNT_SUBSCRIPTION,
    { variables: { communityname } }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data === undefined) return <div>Data is undefined</div>;

  return <div>Number of results: {data.count}</div>;
};

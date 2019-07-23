import React from "react";
import { useQuery } from "react-apollo-hooks";
import { ALL_RESULTS_QUERY, ResultsQueryResponse, Result } from "./queries";
import { CircularProgress } from "@material-ui/core";
import { CommunityNameProps } from "./RouteProps";
import { ResultsTable } from "./ResultsTable";

type Props = {
  dateFrom?: Date;
  dateTo?: Date;
  highlightNewResults: boolean;
} & CommunityNameProps;

export const Results: React.FC<Props> = ({
  communityname,
  dateFrom,
  dateTo,
  highlightNewResults
}) => {
  const lastFetchedResultsRef = React.useRef<readonly Result[] | null>(null);

  const [newResults, setNewResults] = React.useState<readonly Result[]>([]);

  const allResultsQuery = useQuery<ResultsQueryResponse>(ALL_RESULTS_QUERY, {
    variables: { communityname, dateFrom, dateTo }
  });

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

  if (allResultsQuery.loading) return <CircularProgress />;
  if (allResultsQuery.error) return <p>Error!</p>;
  if (allResultsQuery.data === undefined) return <p>Data is undefined</p>;

  return (
    <ResultsTable
      communityname={communityname}
      results={allResultsQuery.data.results}
      newResults={highlightNewResults ? newResults : []}
    />
  );
};

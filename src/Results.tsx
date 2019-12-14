import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ALL_RESULTS_QUERY } from "./queries";
import { CircularProgress } from "@material-ui/core";
import { CommunityNameProps } from "./RouteProps";
import { ResultsTable } from "./ResultsTable";
import {
  AllResults_results as Result,
  AllResults
} from "./__generated__/AllResults";
import { SET_USER_NAME } from "./localState";

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

  const allResultsQuery = useQuery<AllResults>(ALL_RESULTS_QUERY, {
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

  // TODO: Type for mutation
  const [mutate] = useMutation(SET_USER_NAME, {
    variables: { userName: "Test2" }
  });

  const setUserName = () => {
    mutate();
  };

  if (allResultsQuery.loading) return <CircularProgress />;
  if (allResultsQuery.error) return <p>Error!</p>;
  if (allResultsQuery.data === undefined) return <p>Data is undefined</p>;

  return (
    <>
      <button onClick={setUserName}>Test</button>
      <ResultsTable
        communityname={communityname}
        results={allResultsQuery.data.results}
        newResults={highlightNewResults ? newResults : []}
      />
    </>
  );
};

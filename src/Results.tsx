import * as React from "react";
import { useQuery } from "react-apollo-hooks";
import { ALL_RESULTS_QUERY, ResultsQueryResponse } from "./queries";

export const Results: React.FC = () => {
  const { data, error, loading } = useQuery<ResultsQueryResponse>(
    ALL_RESULTS_QUERY
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (data === undefined) return <p>Data is undefined</p>;

  return (
    <div>
      <ul>
        {data.results.map(r => (
          <li key={r.id}>
            <span>{r.date}</span>
            <span>{r.player1.name}</span>
            <span>{r.player1goals}</span>
            <span> : </span>
            <span>{r.player2goals}</span>
            <span>{r.player2.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

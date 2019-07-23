import React from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { AddResult } from "./AddResult";
import { Results } from "./Results";
import { CommunityNameProps } from "./RouteProps";
import { startOfWeek, endOfWeek } from "date-fns";

export const AddResultPage: React.FC<
  RouteComponentProps<CommunityNameProps>
> = ({ communityname }) => {
  const now = new Date();
  const startDate = startOfWeek(now);
  const endDate = endOfWeek(now);

  return communityname ? (
    <>
      <AddResult
        communityname={communityname}
        dateFrom={startDate}
        dateTo={endDate}
      />
      <Results
        communityname={communityname}
        dateFrom={startDate}
        dateTo={endDate}
        highlightNewResults={true}
      />
      <Link to={`/${communityname}/history`}>All Results</Link>
    </>
  ) : (
    <div>Invalid route</div>
  );
};

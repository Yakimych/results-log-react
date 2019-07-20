import React from "react";
import { RouteComponentProps } from "@reach/router";
import { AddResult } from "./AddResult";
import { Results } from "./Results";
import { CommunityNameProps } from "./RouteProps";

export const AllResultsPage: React.FC<
  RouteComponentProps<CommunityNameProps>
> = ({ communityname }) =>
  communityname ? (
    <>
      <AddResult communityname={communityname} />
      <Results communityname={communityname} />
    </>
  ) : (
    <div>Invalid route</div>
  );

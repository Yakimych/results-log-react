import React from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { AddResult } from "./AddResult";
import { Results } from "./Results";
import { CommunityNameProps } from "./RouteProps";
import { startOfWeek, endOfWeek } from "date-fns";
import { ExpansionPanel, ExpansionPanelSummary, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { WeeklyLeaderboard } from "./WeeklyLeaderboard";

export const AddResultPage: React.FC<
  RouteComponentProps<CommunityNameProps>
> = ({ communityname }) => {
  const now = new Date();
  const startDate = startOfWeek(now, { weekStartsOn: 1 });
  const endDate = endOfWeek(now);

  return communityname ? (
    <>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Fab size="small" color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </ExpansionPanelSummary>
        <AddResult
          communityname={communityname}
          dateFrom={startDate}
          dateTo={endDate}
        />
      </ExpansionPanel>
      <Results
        communityname={communityname}
        dateFrom={startDate}
        dateTo={endDate}
        highlightNewResults={true}
      />
      <Link to={`/${communityname}/history`}>All Results</Link>
      <WeeklyLeaderboard
        communityname={communityname}
        dateFrom={startDate}
        dateTo={endDate}
      />
    </>
  ) : (
    <div>Invalid route</div>
  );
};

import React from "react";
import { Streak, formatDateTime } from "./utils";
import { Paper, Typography } from "@material-ui/core";

type Props = {
  streakName: string;
  streak: Streak;
};

export const StreakView: React.FC<Props> = ({ streakName, streak }) => (
  <>
    {/* TODO: Style this properly */}
    <Paper style={{ marginTop: "10px", marginBottom: "6px" }}>
      <Typography>
        {streakName}:{" "}
        <span className="marked">{streak.numberOfMatches} match(es)</span>
      </Typography>
      <Typography>
        Started{" "}
        <span className="date-time">{formatDateTime(streak.startedAt)}</span>
      </Typography>
      {streak.endedAt !== null ? (
        <Typography>
          Ended{" "}
          <span className="date-time">{formatDateTime(streak.endedAt)}</span>
          {streak.endedBy !== null ? (
            <>
              {" "}
              by <span className="marked">{streak.endedBy.name}</span>
            </>
          ) : null}
        </Typography>
      ) : null}
    </Paper>
  </>
);

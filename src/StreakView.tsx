import React from "react";
import { Streak, formatDate } from "./utils";
import { Paper, Typography } from "@material-ui/core";

type Props = {
  streakName: string;
  streak: Streak;
};

export const StreakView: React.FC<Props> = ({ streakName, streak }) => (
  <>
    {/* TODO: Format this */}
    <Paper>
      <Typography>
        {streakName}: {streak.numberOfMatches} match(es)
      </Typography>
      {/* TODO: Display time too */}
      <Typography>Started {formatDate(streak.startedAt)}</Typography>
      {streak.endedAt !== null ? (
        <Typography>
          Ended {formatDate(streak.endedAt)}
          {streak.endedBy !== null ? ` by ${streak.endedBy.name}` : ""}
        </Typography>
      ) : null}
    </Paper>
  </>
);

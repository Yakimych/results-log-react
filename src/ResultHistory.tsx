import React from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Results } from "./Results";
import { CommunityNameProps } from "./RouteProps";
import { Box, TextField, Button, Typography } from "@material-ui/core";
import { formatDate } from "./utils";
import { addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { WeeklyLeaderboard } from "./WeeklyLeaderboard";

export const ResultHistory: React.FC<
  RouteComponentProps<CommunityNameProps>
> = ({ communityname }) => {
  const [date, setDate] = React.useState<Date>(new Date());
  const incrementWeek = () => setDate(d => addWeeks(d, 1));
  const decrementWeek = () => setDate(d => addWeeks(d, -1));
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  const endDate = endOfWeek(date, { weekStartsOn: 1 });

  return communityname ? (
    <>
      <Link to={`/${communityname}`}>Back to Start Page</Link>
      <Box margin="10px" textAlign="center">
        <Button variant="contained" onClick={decrementWeek}>
          PREV
        </Button>
        <TextField
          type="date"
          value={formatDate(date)}
          onChange={e => setDate(new Date(e.target.value))}
        />
        <Button variant="contained" onClick={incrementWeek}>
          NEXT
        </Button>
      </Box>
      <Box textAlign="center">
        Results from {formatDate(startDate)} to {formatDate(endDate)}
      </Box>
      <WeeklyLeaderboard
        communityname={communityname}
        dateFrom={startDate}
        dateTo={endDate}
      />
      <Typography variant="h6">Results</Typography>
      <Results
        communityname={communityname}
        dateFrom={startDate}
        dateTo={endDate}
        highlightNewResults={false}
      />
    </>
  ) : (
    <div>Invalid route</div>
  );
};

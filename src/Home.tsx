import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import createSpacing from "@material-ui/core/styles/createSpacing";
import { RouteComponentProps } from "@reach/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 2)
    }
  })
);

export const Home: React.FC<RouteComponentProps> = () => {
  const classes = useStyles(createSpacing(10));

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Welcome to ResultLog
        </Typography>
        <Typography component="p">
          Save all match results in order to analyze, view head-to-head records,
          analyze stats and more.
        </Typography>
        <Typography component="p">
          Found a bug or missing a feature? File an issue in the{" "}
          <a href="https://github.com/Yakimych/results-log-react">
            GitHub repo
          </a>
          .
        </Typography>
      </Paper>
    </div>
  );
};

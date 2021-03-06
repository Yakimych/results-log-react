import React from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { ALL_PLAYERS_QUERY, ALL_RESULTS_QUERY } from "./queries";
import {
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { ADD_RESULT_MUTATION } from "./mutations";
import { formatDate, withCurrentTime } from "./utils";
import { GoalsPicker } from "./GoalsPicker";
import { CommunityNameProps } from "./RouteProps";
import { PlayerPicker } from "./PlayerPicker";
import { Players } from "./__generated__/Players";

type Props = {
  dateFrom?: Date;
  dateTo?: Date;
} & CommunityNameProps;

export const AddResult: React.FC<Props> = ({
  communityname,
  dateFrom,
  dateTo
}) => {
  const { data, error, loading } = useQuery<Players>(ALL_PLAYERS_QUERY, {
    variables: { communityname }
  });

  const [addResultMutation] = useMutation(ADD_RESULT_MUTATION, {
    refetchQueries: [
      {
        query: ALL_PLAYERS_QUERY,
        variables: { communityname }
      },
      {
        query: ALL_RESULTS_QUERY,
        variables: { communityname, dateFrom, dateTo }
      }
    ]
  });

  const [player1name, setPlayer1name] = React.useState<string | null>(null);
  const [goals1, setGoals1] = React.useState<number>(0);

  const [player2name, setPlayer2name] = React.useState<string | null>(null);
  const [goals2, setGoals2] = React.useState<number>(0);

  const [extraTime, setExtraTime] = React.useState<boolean>(false);
  const toggleExtraTime = () => setExtraTime(oldExtraTime => !oldExtraTime);

  const [date, setDate] = React.useState<Date>(new Date());
  const [isAddingResult, setIsAddingResult] = React.useState<boolean>(false);

  const resetState = () => {
    setPlayer1name(null);
    setPlayer2name(null);
    setGoals1(0);
    setGoals2(0);
    setExtraTime(false);
    setDate(new Date());
  };

  const addResult = () => {
    if (
      !player1name ||
      player1name.length === 0 ||
      !player2name ||
      player2name.length === 0
    ) {
      alert("You must select both players!");
      return;
    }

    if (goals1 === goals2) {
      alert("A game cannot end in a draw!");
      return;
    }

    if (Math.abs(goals1 - goals2) !== 1 && extraTime === true) {
      alert("Games with Extra Time cannot have more than one goal difference!");
      return;
    }

    if (player1name && player2name) {
      if (player1name === player2name) {
        alert("You must select two DIFFERENT players!");
        return;
      }

      setIsAddingResult(true);
      addResultMutation({
        variables: {
          communityname,
          player1name,
          player2name,
          date: withCurrentTime(date, new Date()),
          player1goals: goals1,
          player2goals: goals2,
          extratime: extraTime
        }
      })
        .then(() => {
          resetState();
          setIsAddingResult(false);
        })
        .catch(e => {
          console.error("Error: ", e);
          // TODO: Error message for the user
        });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (data === undefined) return <p>Data is undefined</p>;

  const playerNames: readonly string[] = data.players.map(p => p.name);

  return (
    <Paper style={{ width: 550, marginBottom: 30 }}>
      <div style={{ display: "flex" }}>
        <PlayerPicker
          disabled={isAddingResult}
          placeholderText="Player1"
          playerNames={playerNames}
          selectedPlayerName={player1name}
          onChange={setPlayer1name}
        />
        <GoalsPicker
          disabled={isAddingResult}
          selectedGoals={goals1}
          onChange={setGoals1}
        />
        <GoalsPicker
          disabled={isAddingResult}
          selectedGoals={goals2}
          onChange={setGoals2}
        />
        <PlayerPicker
          disabled={isAddingResult}
          placeholderText="Player2"
          playerNames={playerNames}
          selectedPlayerName={player2name}
          onChange={setPlayer2name}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          disabled={isAddingResult}
          variant="contained"
          color="primary"
          onClick={addResult}
        >
          Submit
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              disabled={isAddingResult}
              color="default"
              checked={extraTime}
              onClick={toggleExtraTime}
            />
          }
          label="Extra Time"
        />
        <TextField
          disabled={isAddingResult}
          type="date"
          value={formatDate(date)}
          onChange={e => setDate(new Date(e.target.value))}
        />
      </div>
    </Paper>
  );
};

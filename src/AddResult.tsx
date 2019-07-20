import CreatableSelect from "react-select/creatable";
import * as React from "react";
import { ValueType } from "react-select/src/types";
import { Option } from "react-select/src/filters";
import { useQuery, useMutation } from "react-apollo-hooks";
import {
  PlayersQueryResponse,
  ALL_PLAYERS_QUERY,
  ALL_RESULTS_QUERY
} from "./queries";
import {
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { ADD_RESULT_MUTATION } from "./mutations";
import { getCommunityNameFromUrl, formatDate, withCurrentTime } from "./utils";
import { GoalsPicker } from "./GoalsPicker";
import { CommunityNameProps } from "./RouteProps";

export const AddResult: React.FC<CommunityNameProps> = ({ communityname }) => {
  const { data, error, loading } = useQuery<PlayersQueryResponse>(
    ALL_PLAYERS_QUERY,
    { variables: { communityname } }
  );

  const [addResultMutation] = useMutation(ADD_RESULT_MUTATION, {
    refetchQueries: [
      {
        query: ALL_PLAYERS_QUERY,
        variables: { communityname }
      },
      { query: ALL_RESULTS_QUERY, variables: { communityname } }
    ]
  });

  const [player1, setPlayer1] = React.useState<ValueType<Option>>(null);
  const [goals1, setGoals1] = React.useState<number>(0);

  const [player2, setPlayer2] = React.useState<ValueType<Option>>(null);
  const [goals2, setGoals2] = React.useState<number>(0);

  const [extraTime, setExtraTime] = React.useState<boolean>(false);
  const toggleExtraTime = () => setExtraTime(oldExtraTime => !oldExtraTime);

  const [date, setDate] = React.useState<Date>(new Date());

  const resetState = () => {
    setPlayer1(null);
    setPlayer2(null);
    setGoals1(0);
    setGoals2(0);
    setExtraTime(false);
    setDate(new Date());
  };

  const addResult = () => {
    if (
      !player1 ||
      (player1 as Option).value.length === 0 ||
      !player2 ||
      (player2 as Option).value.length === 0
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

    if (player1 && player2) {
      const player1name = (player1 as Option).value;
      const player2name = (player2 as Option).value;
      if (player1name === player2name) {
        alert("You must select two DIFFERENT players!");
        return;
      }

      addResultMutation({
        variables: {
          communityname,
          player1name,
          player2name,
          date: withCurrentTime(date),
          player1goals: goals1,
          player2goals: goals2,
          extratime: extraTime
        }
      });
      resetState();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (data === undefined) return <p>Data is undefined</p>;

  const options: readonly Option[] = data.players.map(p => ({
    label: p.name,
    value: p.name,
    data: null
  }));

  return (
    <Paper style={{ width: 650, marginBottom: 30 }}>
      <div style={{ display: "flex" }}>
        <CreatableSelect
          styles={{
            control: styles => ({
              ...styles,
              width: 200,
              height: 50
            })
          }}
          placeholder="Player1"
          value={player1}
          options={options}
          onChange={selectedPlayer => setPlayer1(selectedPlayer)}
        />
        <GoalsPicker selectedGoals={goals1} onChange={setGoals1} />
        <GoalsPicker selectedGoals={goals2} onChange={setGoals2} />
        <CreatableSelect
          styles={{
            control: styles => ({
              ...styles,
              width: 200,
              height: 50
            })
          }}
          placeholder="Player2"
          value={player2}
          options={options}
          onChange={selectedPlayer => setPlayer2(selectedPlayer)}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="default"
              checked={extraTime}
              onClick={toggleExtraTime}
            />
          }
          label="Extra Time"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="primary" onClick={addResult}>
          Submit
        </Button>
        <TextField
          type="date"
          value={formatDate(date)}
          onChange={e => setDate(new Date(e.target.value))}
        />
      </div>
    </Paper>
  );
};

import CreatableSelect from "react-select/creatable";
import * as React from "react";
import { useState } from "react";
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

const formatDate = (date: Date) => date.toISOString().substring(0, 10);

const validNumberOfGoals = (goalsString: string) => {
  const goalsNumber = Number(goalsString);
  return isNaN(goalsNumber) ? 0 : Math.max(Math.floor(goalsNumber), 0);
};

// TODO: Remove as soon as the value gets picked out from the URL
const communityname = process.env.REACT_APP_COMMUNITY_NAME;

export const AddResult: React.FC = () => {
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

  const [player1, setPlayer1] = useState<ValueType<Option>>(null);
  const [goals1, setGoals1] = useState<number>(0);

  const [player2, setPlayer2] = useState<ValueType<Option>>(null);
  const [goals2, setGoals2] = useState<number>(0);

  const [extraTime, setExtraTime] = useState<boolean>(false);
  const toggleExtraTime = () => setExtraTime(oldExtraTime => !oldExtraTime);

  const [date, setDate] = useState<Date>(new Date());

  const addResult = () => {
    if (player1 && player2) {
      addResultMutation({
        variables: {
          communityname,
          player1name: (player1 as Option).value, // TODO: Stop using react-select
          player2name: (player2 as Option).value,
          date: date,
          player1goals: goals1,
          player2goals: goals2,
          extratime: extraTime
        }
      });
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
        <TextField
          type="number"
          style={{ width: 80 }}
          variant="outlined"
          value={goals1}
          onChange={e => setGoals1(validNumberOfGoals(e.target.value))}
        />
        <TextField
          type="number"
          style={{ width: 80 }}
          variant="outlined"
          value={goals2}
          onChange={e => setGoals2(validNumberOfGoals(e.target.value))}
        />
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

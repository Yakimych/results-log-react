import CreatableSelect from "react-select/creatable";
import * as React from "react";
import { useState } from "react";
import { ValueType } from "react-select/src/types";
import { Option } from "react-select/src/filters";
import { useQuery } from "react-apollo-hooks";
import { PlayersQueryResponse, ALL_PLAYERS_QUERY } from "./queries";
import {
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";

const formatDate = (date: Date) => date.toISOString().substring(0, 10);

const validNumberOfGoals = (goalsString: string) => {
  const goalsNumber = Number(goalsString);
  return isNaN(goalsNumber) ? 0 : Math.max(Math.floor(goalsNumber), 0);
};

export const AddResult: React.FC = () => {
  const { data, error, loading } = useQuery<PlayersQueryResponse>(
    ALL_PLAYERS_QUERY
  );

  const [player1, setPlayer1] = useState<ValueType<Option>>(null);
  const [goals1, setGoals1] = useState<number>(0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (data === undefined) return <p>Data is undefined</p>;

  const options: readonly Option[] = data.players.map(p => ({
    label: p.name,
    value: p.name,
    data: null
  }));

  return (
    <Paper style={{ width: 600, marginBottom: 30 }}>
      <div style={{ display: "flex" }}>
        <CreatableSelect
          styles={{
            control: styles => ({
              ...styles,
              width: 200
            })
          }}
          placeholder="Player1"
          value={player1}
          options={options}
          onChange={selectedPlayer => setPlayer1(selectedPlayer)}
        />
        <TextField
          type="number"
          style={{ width: 60 }}
          variant="outlined"
          value={goals1}
          onChange={e => setGoals1(validNumberOfGoals(e.target.value))}
        />
        <TextField
          type="number"
          style={{ width: 60 }}
          variant="outlined"
          value={goals1}
          onChange={e => setGoals1(validNumberOfGoals(e.target.value))}
        />
        <CreatableSelect
          styles={{
            control: styles => ({
              ...styles,
              width: 200
            })
          }}
          placeholder="Player2"
          value={player1}
          options={options}
          onChange={selectedPlayer => setPlayer1(selectedPlayer)}
        />
        <FormControlLabel control={<Checkbox color="default" />} label="ET" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="primary">
          Submit
        </Button>
        <TextField type="date" defaultValue={formatDate(new Date())} />
      </div>
    </Paper>
  );
};

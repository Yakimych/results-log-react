import CreatableSelect from "react-select/creatable";
import { gql } from "apollo-boost";
import * as React from "react";
import { useState } from "react";
import { ValueType } from "react-select/src/types";
import { Option } from "react-select/src/filters";
import { useQuery } from "react-apollo-hooks";

const ALL_PLAYERS_QUERY = gql`
  {
    players {
      id
      name
    }
  }
`;

type Player = {
  id: number;
  name: string;
};

type PlayersQueryResult = {
  players: readonly Player[];
};

const validNumber = (goalsString: string) => {
  const goalsNumber = Number(goalsString);
  return isNaN(goalsNumber) ? 0 : goalsNumber;
};

export const AddResult: React.FC = () => {
  const { data, error, loading } = useQuery<PlayersQueryResult>(
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
    <div>
      <CreatableSelect
        placeholder="Player1"
        value={player1}
        options={options}
        onChange={selectedPlayer => setPlayer1(selectedPlayer)}
      />
      <input
        type="text"
        value={goals1}
        onChange={e => setGoals1(validNumber(e.target.value))}
      />
    </div>
  );
};

import { Query } from "react-apollo";
import CreatableSelect from "react-select/creatable";
import { gql } from "apollo-boost";
import * as React from "react";
import { useState } from "react";
import { ValueType } from "react-select/src/types";
import { Option } from "react-select/src/filters";

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

const AddResultQuery: React.FC = () => (
  <Query<PlayersQueryResult> query={ALL_PLAYERS_QUERY}>
    {result => {
      if (result.loading) return <p>Loading...</p>;
      if (result.error) return <p>Error!</p>;
      if (result.data === undefined) return <p>Data is undefined</p>;

      return <AddResult players={result.data.players} />;
    }}
  </Query>
);

const AddResult: React.FC<PlayersQueryResult> = props => {
  const options: readonly Option[] = props.players.map(p => ({
    label: p.name,
    value: p.name,
    data: null
  }));

  const [player1, setPlayer1] = useState<ValueType<Option>>(null);
  const [goals1, setGoals1] = useState<number>(0);

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

export default AddResultQuery;

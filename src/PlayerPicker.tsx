import React from "react";
import { TextField, NativeSelect, OutlinedInput } from "@material-ui/core";

type Props = {
  placeholderText?: string;
  playerNames: readonly string[];
  selectedPlayerName: string | null;
  onChange: (playerName: string) => void;
};

const NEW_PLAYER_VALUE = "NEW_PLAYER";

export const PlayerPicker: React.FC<Props> = props => {
  const [isInCustomMode, setIsInCustomMode] = React.useState<boolean>(false);

  const handleSelectChange = (value: string) => {
    if (value === NEW_PLAYER_VALUE) {
      // Clear the value when switching to "plain" input
      props.onChange("");
      setIsInCustomMode(true);
    } else {
      props.onChange(value);
    }
  };

  React.useEffect(() => {
    if (props.selectedPlayerName === null) {
      setIsInCustomMode(false);
    }
  }, [props.selectedPlayerName]);

  return (
    <>
      {isInCustomMode ? (
        <TextField
          className="highlighted"
          autoFocus
          style={{ width: 200 }}
          variant="outlined"
          inputProps={{ maxLength: 20 }}
          value={props.selectedPlayerName || ""}
          onChange={e => props.onChange(e.target.value)}
        />
      ) : (
        <NativeSelect
          style={{ width: 200 }}
          onChange={e => handleSelectChange(e.target.value)}
          value={props.selectedPlayerName || ""}
          input={<OutlinedInput style={{ width: 60 }} labelWidth={0} />}
        >
          <option key="empty" value="" disabled>
            {props.placeholderText}
          </option>
          {props.playerNames.map(p => (
            <option value={p} key={`players_${p}`}>
              {p}
            </option>
          ))}
          <option key="new_player" value={NEW_PLAYER_VALUE}>
            + Add new player...
          </option>
        </NativeSelect>
      )}
    </>
  );
};

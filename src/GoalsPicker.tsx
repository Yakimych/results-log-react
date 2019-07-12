import * as React from "react";
import { TextField, NativeSelect, OutlinedInput } from "@material-ui/core";
import { validNumberOfGoals } from "./utils";

type Props = {
  selectedGoals: number;
  onChange: (goals: number) => void;
};

const goalValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const MORE_GOALS_VALUE = "MORE_GOALS";

export const GoalsPicker: React.FC<Props> = props => {
  const [isInCustomMode, setIsInCustomMode] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectChange = (value: string) => {
    if (value === MORE_GOALS_VALUE) {
      setIsInCustomMode(true);
      // TODO: Is there a way to do this without setTimeout?
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    } else {
      props.onChange(Number(value));
    }
  };

  return (
    <>
      {isInCustomMode ? (
        <TextField
          inputRef={inputRef}
          type="number"
          style={{ width: 80 }}
          variant="outlined"
          value={props.selectedGoals.toString()}
          onChange={e => props.onChange(validNumberOfGoals(e.target.value))}
        />
      ) : (
        <NativeSelect
          onChange={e => handleSelectChange(e.target.value)}
          value={props.selectedGoals}
          input={<OutlinedInput style={{ width: 60 }} labelWidth={0} />}
        >
          {goalValues.map(g => (
            <option value={g} key={`goals_${g}`}>
              {g.toString()}
            </option>
          ))}
          <option key="more_goals" value={MORE_GOALS_VALUE}>
            More goals!
          </option>
        </NativeSelect>
      )}
    </>
  );
};

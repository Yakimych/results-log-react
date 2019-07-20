import React from "react";
import { RouteComponentProps } from "@reach/router";

type Props = {
  player1Name: string;
  player2Name: string;
};

export const HeadToHead: React.FC<RouteComponentProps<Props>> = props => (
  <>
    <h1>Head to Head Record</h1>
    <div>{props.player1Name}</div>
    <div>{props.player2Name}</div>
  </>
);

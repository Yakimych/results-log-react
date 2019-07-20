import React from "react";
import { RouteComponentProps } from "@reach/router";
import { CommunityNameProps } from "./RouteProps";

type Props = {
  playerName: string;
} & CommunityNameProps;

export const PlayerResults: React.FC<RouteComponentProps<Props>> = props => (
  <>
    <h1>Player results</h1>
    <div>{props.playerName}</div>
  </>
);

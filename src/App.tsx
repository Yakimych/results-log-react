import React from "react";
import "./App.css";
import { Router } from "@reach/router";
import { Home } from "./Home";
import { AddResultPage } from "./AddResultPage";
import { HeadToHead } from "./HeadToHead";
import { PlayerResults } from "./PlayerResults";
import { ResultHistory } from "./ResultHistory";
import { useQuery } from "react-apollo-hooks";
import { USER_INFO } from "./localQueries";
import { UserInfo } from "./__generated__/UserInfo";

const App: React.FC = () => {
  const { data } = useQuery<UserInfo>(USER_INFO);

  const headerText = data?.userName !== null ? data?.userName : "No saved user";

  return (
    <div className="App">
      <header className="App-header">Result log: {headerText}</header>
      <Router>
        <Home path="/" />
        <AddResultPage path=":communityname" />
        <ResultHistory path=":communityname/history" />
        <PlayerResults path=":communityname/:playername" />
        <HeadToHead path=":communityname/:player1name/:player2name" />
      </Router>
    </div>
  );
};

export default App;

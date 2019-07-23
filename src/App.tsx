import React from "react";
import "./App.css";
import { Router } from "@reach/router";
import { Home } from "./Home";
import { AddResultPage } from "./AddResultPage";
import { HeadToHead } from "./HeadToHead";
import { PlayerResults } from "./PlayerResults";
import { ResultHistory } from "./ResultHistory";

const App: React.FC = () => (
  <div className="App">
    <header className="App-header">Result log</header>
    <Router>
      <Home path="/" />
      <AddResultPage path=":communityname" />
      <ResultHistory path=":communityname/history" />
      <PlayerResults path=":communityname/:playername" />
      <HeadToHead path=":communityname/:player1name/:player2name" />
    </Router>
  </div>
);

export default App;

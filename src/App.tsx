import React from "react";
import "./App.css";
import { Router } from "@reach/router";
import { Home } from "./Home";
import { AllResultsPage } from "./AllResultsPage";
import { HeadToHead } from "./HeadToHead";
import { PlayerResults } from "./PlayerResults";

const App: React.FC = () => (
  <div className="App">
    <header className="App-header">Result log</header>
    <Router>
      <Home path="/" />
      <AllResultsPage path=":communityname" />
      <PlayerResults path=":communityname/:playerName" />
      <HeadToHead path=":communityname/:player1Name/:player2Name" />
    </Router>
  </div>
);

export default App;

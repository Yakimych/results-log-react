import React from "react";
import "./App.css";
import { AddResult } from "./AddResult";
import { Results } from "./Results";
import { ResultCountIndicator } from "./ResultCountIndicator";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">Result log</header>
      <AddResult />
      <Results />
      <ResultCountIndicator />
    </div>
  );
};

export default App;

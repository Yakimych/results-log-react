import React from "react";
import "./App.css";
import { AddResult } from "./AddResult";
import { Results } from "./Results";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">Result log</header>
      <AddResult />
      <Results />
    </div>
  );
};

export default App;

import React from "react";
import "./App.css";
import { AddResult } from "./AddResult";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">Result log</header>
      <AddResult />
    </div>
  );
};

export default App;

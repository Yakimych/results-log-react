import React from "react";
import "./App.css";
import AddResultQuery from "./AddResult";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">Result log</header>
      <AddResultQuery />
    </div>
  );
};

export default App;

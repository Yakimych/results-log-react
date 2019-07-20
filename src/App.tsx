import React from "react";
import "./App.css";
import { Router } from "@reach/router";
import { Home } from "./Home";
import { AllResultsPage } from "./AllResultsPage";

const App: React.FC = () => (
  <div className="App">
    <header className="App-header">Result log</header>
    <Router>
      <Home path="/" />
      <AllResultsPage path=":communityname" />
    </Router>
  </div>
);

export default App;

import React from "react";
import "./App.css";
import { AddResult } from "./AddResult";
import { Results } from "./Results";
import { getCommunityNameFromUrl } from "./utils";
import { StartPage } from "./StartPage";

const App: React.FC = () => {
  const communityName = getCommunityNameFromUrl();

  return (
    <div className="App">
      <header className="App-header">Result log</header>
      {communityName.length === 0 ? (
        <StartPage />
      ) : (
        <>
          <AddResult />
          <Results />
        </>
      )}
    </div>
  );
};

export default App;

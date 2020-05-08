import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { LangContext } from "./AppContext";
import { Navbar, ItemSearch, CharacterSearch } from "./components";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <LangContext.Provider>
          <Route exact path="/">
            <Redirect to="/itemSearch" />
          </Route>
          <Route path="/itemSearch" component={ItemSearch} />
          <Route path="/characterSearch" component={CharacterSearch} />
        </LangContext.Provider>
      </Router>
    </div>
  );
}

export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { LangContext } from "./AppContext";
import {
  Navbar,
  ItemSearch,
  CharacterSearch,
  Signup,
  Login,
} from "./components";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <LangContext.Provider>
          <Switch>
            <Route exact path="/">
              <Redirect to="/itemSearch" />
            </Route>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/itemSearch" component={ItemSearch} />
            <Route path="/characterSearch" component={CharacterSearch} />
          </Switch>
        </LangContext.Provider>
      </Router>
    </div>
  );
}

export default App;

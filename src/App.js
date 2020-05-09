import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { LangContext } from "./AppContext";
import {
  Menu,
  Welcome,
  ItemSearch,
  CharacterSearch,
  SignupPage,
  LoginPage,
} from "./components";

import "./App.css";

function App() {
  return (
    <div className="App container-fluid">
      <Router>
        <Menu />
        <LangContext.Provider>
          <div className="container">
            <div className="row mt-5 d-flex justify-content-center align-items-center">
              <Switch>
                <Route exact path="/" component={Welcome} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/itemSearch" component={ItemSearch} />
                <Route path="/characterSearch" component={CharacterSearch} />
              </Switch>
            </div>
          </div>
        </LangContext.Provider>
      </Router>
    </div>
  );
}

export default App;

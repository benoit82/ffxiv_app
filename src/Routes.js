import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { AuthApi } from "./AppContext";
import {
  Welcome,
  ItemSearch,
  CharacterSearch,
  SignupPage,
  LoginPage,
  Admin,
} from "./components";
import ProtectedRoute from "./utils/ProtectedRoute";

const Routes = () => {
  const Auth = useContext(AuthApi);
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/itemSearch" component={ItemSearch} />
      <Route path="/characterSearch" component={CharacterSearch} />
      <ProtectedRoute path="/admin" auth={Auth.auth} component={Admin} />
    </Switch>
  );
};

export default Routes;

import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { UserApi } from "./AppContext";
import {
  Welcome,
  ItemSearch,
  SignupPage,
  LoginPage,
  ForgottenPasswordPage,
  Admin,
  UserOptionPage,
} from "./components";
import ProtectedRoute from "./utils/ProtectedRoute";

const Routes = () => {
  const User = useContext(UserApi);

  const { user } = User;

  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/resetpassword" component={ForgottenPasswordPage} />
      <Route path="/itemSearch" component={ItemSearch} />
      <ProtectedRoute
        path="/admin"
        allowedUser={user.isAdmin}
        component={Admin}
      />
      <ProtectedRoute
        path="/user"
        allowedUser={user.isLoggedIn}
        component={UserOptionPage}
      />
    </Switch>
  );
};

export default Routes;

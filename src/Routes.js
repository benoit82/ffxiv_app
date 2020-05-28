import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { UserApi } from "./AppContext";
import {
  Welcome,
  ItemSearch,
  SignupPage,
  LoginPage,
  ForgottenPasswordPage,
  AdminOptionPage,
  UserOptionPage,
  EditCharacter,
  ViewRoster,
  RosterEdit,
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
        allowedUser={user.isAdmin || user.isRaidLeader}
        component={AdminOptionPage}
      />
      <ProtectedRoute
        path="/roster/edit/:roster_id"
        allowedUser={user.isAdmin || user.isRaidLeader}
        component={RosterEdit}
      />
      <Route path="/roster/:roster_id" component={ViewRoster} />
      <ProtectedRoute
        path="/user"
        allowedUser={user.isLoggedIn}
        component={UserOptionPage}
      />
      <ProtectedRoute
        path="/chr/:chr_id"
        allowedUser={user.isLoggedIn}
        component={EditCharacter}
      />
    </Switch>
  );
};

export default Routes;

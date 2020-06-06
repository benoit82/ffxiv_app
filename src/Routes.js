import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { UserApi } from "./utils/appContext";
import {
  Welcome,
  ItemSearch,
  SignupPage,
  LoginPage,
  ForgottenPasswordPage,
  AdminOptionPage,
  ViewRoster,
  RosterEdit,
  UserParamPage,
} from "./components";
import ProtectedRoute from "./utils/protectedRoute";

const Routes = () => {
  const User = useContext(UserApi);

  const { user } = User;

  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/resetpassword" component={ForgottenPasswordPage} />
      <Route path="/item" component={ItemSearch} />
      <ProtectedRoute
        path="/admin"
        allowedUser={user.isAdmin}
        component={AdminOptionPage}
      />
      <ProtectedRoute
        path="/roster/edit/:roster_id"
        allowedUser={user.isAdmin || user.refRosterRaidLeader !== null}
        component={RosterEdit}
      />
      <Route path="/roster/:roster_id" component={ViewRoster} />
      <ProtectedRoute
        path="/param"
        allowedUser={user.isLoggedIn}
        component={UserParamPage}
      />
    </Switch>
  );
};

export default Routes;

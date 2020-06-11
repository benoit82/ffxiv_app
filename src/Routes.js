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
  RosterView,
  RosterEdit,
  UserParamPage,
  ChrOptionPage,
  EditCharacter,
} from "./components";
import ProtectedRoute from "./utils/protectedRoute";
import checkStorage from "./utils/checkStorage";
import { FirebaseContext } from "./components/firebase";
import { RosterCreate } from "./components/roster";

const Routes = () => {
  const User = useContext(UserApi);
  const firebase = useContext(FirebaseContext);

  const { user, setUser } = User;

  checkStorage(firebase, setUser);

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
        path="/roster/create/:character_id"
        allowedUser={user.isLoggedIn}
        component={RosterCreate}
      />
      <ProtectedRoute
        path="/roster/edit/:roster_id"
        allowedUser={user.isAdmin || user.refRosterRaidLeader !== null}
        component={RosterEdit}
      />
      <ProtectedRoute
        path="/roster/view/:roster_id/:jPriority"
        allowedUser={user.isLoggedIn}
        component={RosterView}
      />
      <ProtectedRoute
        exact
        path="/param"
        allowedUser={user.isLoggedIn}
        component={UserParamPage}
      />
      <ProtectedRoute
        path="/param/chr"
        allowedUser={user.isLoggedIn}
        component={ChrOptionPage}
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

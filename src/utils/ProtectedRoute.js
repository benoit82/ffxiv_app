import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { FirebaseContext } from "../components/firebase";
import { UserApi } from "../AppContext";

const ProtectedRoute = ({ allowedUser, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (allowedUser ? <Component /> : <Redirect to="/" />)}
    ></Route>
  );
};

export default ProtectedRoute;

import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ allowedUser, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (allowedUser ? <Component /> : <Redirect to="/login" />)}
    ></Route>
  );
};

export default ProtectedRoute;

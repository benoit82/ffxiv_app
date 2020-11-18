import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = ({ allowedUser, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        allowedUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )}
    />
  )
}

export default ProtectedRoute

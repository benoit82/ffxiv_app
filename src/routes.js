import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import { UserApi } from './utils/appContext'
import {
  Welcome,
  ItemSearch,
  SignupPage,
  LoginPage,
  ForgottenPasswordPage,
  AdminOptionPage,
  RosterView,
  RosterEdit,
  ChrOptionPage,
  EditCharacter,
  UserOptionPage,
  LogPatch
} from './components'
import ProtectedRoute from './utils/protectedRoute'
import checkStorage from './utils/checkStorage'
import { FirebaseContext } from './components/firebase'
import { RosterCreate } from './components/roster'
import About from './components/about/about'

const Routes = () => {
  const User = useContext(UserApi)
  const firebase = useContext(FirebaseContext)

  const { user, setUser } = User

  checkStorage(firebase, setUser)

  return (
    <Switch>
      <Route exact path='/' component={Welcome} />
      <Route exact path='/log' component={LogPatch} />
      <Route path='/signup' component={SignupPage} />
      <Route path='/login' component={LoginPage} />
      <Route path='/resetpassword' component={ForgottenPasswordPage} />
      <Route path='/item' component={ItemSearch} />
      <Route exact path='/about' component={About} />
      <ProtectedRoute
        path='/admin'
        allowedUser={user.isAdmin}
        component={AdminOptionPage}
      />
      <ProtectedRoute
        path='/roster/create/:characterID'
        allowedUser={user.isLoggedIn}
        component={RosterCreate}
      />
      <ProtectedRoute
        path='/roster/edit/:rosterID'
        allowedUser={user.isLoggedIn}
        component={RosterEdit}
      />
      <ProtectedRoute
        path='/roster/view/:rosterID/:jPriority'
        allowedUser={user.isLoggedIn}
        component={RosterView}
      />
      <ProtectedRoute
        exact
        path='/param'
        allowedUser={user.isLoggedIn}
        component={UserOptionPage}
      />
      <ProtectedRoute
        exact
        path='/chr'
        allowedUser={user.isLoggedIn}
        component={ChrOptionPage}
      />
      <ProtectedRoute
        path='/chr/:chrID'
        allowedUser={user.isLoggedIn}
        component={EditCharacter}
      />
    </Switch>
  )
}

export default Routes

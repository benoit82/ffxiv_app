import React, { useContext, useEffect } from 'react'
import LoginForm from './loginForm'
import Alert from 'react-bootstrap/Alert'
import { Link, useLocation, useHistory } from 'react-router-dom'
import checkStorage from '../../utils/checkStorage'
import { UserApi } from '../../utils/appContext'
import { FirebaseContext } from '../firebase'

const LoginPage = () => {
  const firebase = useContext(FirebaseContext)
  const history = useHistory()
  const location = useLocation()
  const User = useContext(UserApi)
  const { user, setUser } = User

  useEffect(() => {
    if (!user.isLoggedIn) {
      checkStorage(firebase, setUser)
    }
    if (user.isLoggedIn) {
      history.replace(location.state ? location.state.from.pathname : '/')
    }
  })

  return (
    <div className='custom__container form__container auto_margin'>
      <h1 className='text-center font-weight-bold'>Connexion</h1>
      <LoginForm />
      <Alert variant='info' className='mt-3'>Nouvel utilisateur ? Aller à la page d'<Link to='/signup'>inscription</Link> !</Alert>
      <Alert variant='info' className='mt-3'><Link to='/resetpassword'>Mot de passe oublié ?</Link></Alert>
    </div>
  )
}

export default LoginPage

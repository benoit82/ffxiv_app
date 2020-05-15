import React from 'react'
import LoginForm from "./LoginForm"
import Alert from 'react-bootstrap/Alert'
import { Link } from 'react-router-dom'

const LoginPage = () => {
    return (
        <div className="col-sm-12 col-md-8 p-3 bg-light">
            <h1 className="text-center font-weight-bold">Connexion</h1>
            <LoginForm />
            <Alert variant="info" className="mt-3">Nouvel utilisateur ? Aller à la page d'<Link to="/signup">inscription</Link> !</Alert>
            <Alert variant="info" className="mt-3"><Link to="/resetpassword">Mot de passe oublié ?</Link></Alert>
        </div>
    )
}

export default LoginPage

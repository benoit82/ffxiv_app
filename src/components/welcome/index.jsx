import React, { useContext } from 'react'
import { AuthApi } from '../../AppContext'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'

const Welcome = () => {

    const Auth = useContext(AuthApi);
    const history = useHistory();

    return (
        <Jumbotron>
            <h1>Bienvenue sur l'application de gestion de roster</h1>
            <p>L'application pour gerer les récompenses de raid dans un premier temps.</p>
            <p>D'autres options viendront compléter l'application dans les futurs versions !</p>
            {!Auth.auth && (
                <>
                    <Button variant="primary" className="mr-2" onClick={() => history.push("/login")}><i className="fas fa-sign-in-alt"></i>Login</Button>
                    <Button variant="success" onClick={() => history.push("/signup")}><i className="fas fa-user-plus"></i>S'inscrire</Button>
                </>
            )}

        </Jumbotron>
    )
}

export default Welcome

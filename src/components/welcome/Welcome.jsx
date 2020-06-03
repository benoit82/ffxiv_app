import React, { useContext } from 'react'
import { UserApi } from '../../utils/appContext'
import Jumbotron from 'react-bootstrap/Jumbotron'
import { Link } from 'react-router-dom'

const Welcome = () => {
    const User = useContext(UserApi)

    const { user } = User;



    return (

        < Jumbotron >
            <h1>\o Lali-ho {user.isLoggedIn && `${user.pseudo}`} ! o/</h1>
            <p>Bienvenue sur l'application pour gerer les récompenses de raid dans un premier temps.</p>
            <p>D'autres options viendront compléter l'application dans les futurs versions !</p>
            {
                !user.isLoggedIn && (
                    <>
                        <Link to="/login" className="btn btn-primary fas fa-sign-in-alt mr-2"> login</Link>
                        <Link to="/signup" className="btn btn-success fas fa-user-plus"> s'inscrire</Link>
                        {/* TODO to be remove ? <Button variant="primary" className="mr-2" onClick={() => history.push("/login")}><i className="fas fa-sign-in-alt"></i></Button>
                        <Button variant="success" onClick={() => history.push("/signup")}><i className="fas fa-user-plus"></i>S'inscrire</Button> */}
                    </>
                )
            }
        </Jumbotron >


    )
}

export default Welcome

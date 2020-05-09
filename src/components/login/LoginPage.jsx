import React from 'react'
import LoginForm from "./LoginForm"

const LoginPage = () => {
    return (
        <div className="container">
            <div className="row mt-5 d-flex justify-content-center align-items-center">
                <div className="col-sm-12 col-md-8 p-3 bg-light border-dark">
                    <h1 className="text-center font-weight-bold">Connexion</h1>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default LoginPage

import React from 'react'
import SignupForm from "./SignupForm"

const SignupPage = () => {
    return (
        <div className="container">
            <div className="row mt-5 d-flex justify-content-center align-items-center">
                <div className="col-sm-12 col-md-8 p-3 bg-light border-dark">
                    <h1 className="text-center font-weight-bold">Inscription</h1>
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}

export default SignupPage

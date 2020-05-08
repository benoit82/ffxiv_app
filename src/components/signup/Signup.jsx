import React, { useState, useRef, useContext } from 'react'
import { FirebaseContext } from '../firebase'

const Signup = () => {

    const data = { pseudo: '', email: '', password: '', confirmPassword: '' }
    const [loginData, setLoginData] = useState(data);
    const [error, setError] = useState({})
    const formRef = useRef(null)
    const { pseudo, email, password, confirmPassword } = loginData;

    const handleChange = (event) => {
        setLoginData({ ...loginData, [event.target.id]: event.target.value })
    }

    const btnDisabled = pseudo === '' || email === '' || password === '' || password !== confirmPassword;

    const handleReset = (event) => {
        event.preventDefault();
        setLoginData(data)
    }

    const firebase = useContext(FirebaseContext);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = loginData;
        try {
            setError({})
            const response = await firebase.signUpUser(email, password);
            setLoginData({ ...data });
            console.log(response);
        } catch (error) {
            setError({ ...error, message: error.message });
        }
    }

    // gestion des erreurs
    const errorMsg = error.message !== '' && <h3>{error.message}</h3>;

    return (
        <>
            <h1>Inscription</h1>
            {errorMsg}
            <form ref={formRef} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="pseudo">Pseudo :
                    <input onChange={handleChange} value={pseudo} type="text" name="pseudo" id="pseudo" autoComplete="off" required /></label>
                </div>
                <div>
                    <label htmlFor="email">Email :
                    <input onChange={handleChange} value={email} type="email" name="email" id="email" required /></label>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe :
                    <input onChange={handleChange} value={password} type="password" name="password" id="password" required /></label>
                </div>
                <div>
                    <label htmlFor="password">Confirmer le mot de passe :
                    <input onChange={handleChange} value={confirmPassword} type="password" name="confirmPassword" id="confirmPassword" required /></label>
                </div>
                <div>
                    <button type="submit" disabled={btnDisabled}>Envoyer</button>
                    <button onClick={handleReset}>Effacer</button>
                </div>
            </form>
        </>
    )
}

export default Signup

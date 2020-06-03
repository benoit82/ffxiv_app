import React, { useState, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../utils/appContext'
import Form from 'react-bootstrap/Form'
import { SendBtn } from "../formElements"
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormCheck from 'react-bootstrap/FormCheck'
import Alert from 'react-bootstrap/Alert'

const LoginForm = () => {
    const firebase = useContext(FirebaseContext)
    const history = useHistory()
    const location = useLocation()
    const [errorMsg, setErrorMsg] = useState(null)
    const User = useContext(UserApi)

    const loginWithFirebase = async (values) => {
        setErrorMsg(null)
        try {
            const response = await firebase.signInUser(values.email.trim(), values.password.trim())
            User.setUser(response)
            values.remindMe ? localStorage.setItem("user", JSON.stringify(response)) : localStorage.removeItem("user")
            if (location.state !== null && location.state.from.pathname === "/admin"
                && !response.isAdmin) {
                setErrorMsg(<Alert variant="danger" className="mt-3">Erreur : <br /><strong>Accès insuffisant pour accèder à la page demandée, redirection dans 2 secondes vers la page d'acceuil</strong></Alert>)
                setTimeout(() => { history.push("/") }, 2000)
            } else {
                history.push(location.state ? location.state.from.pathname : "/")
            }
        } catch (error) {
            setErrorMsg(<Alert variant="danger" className="mt-3">Erreur : <br /><strong>{error.message}</strong></Alert>)
        }
    }

    // schema de validation
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("email invalide")
            .required("champs obligatoire")
        ,
        password: Yup.string()
            .min(6, "Entrez 6 caratères minimum")
            .required("champs obligatoire")
        ,
        remindMe: Yup.boolean()
            .notRequired()
    })


    return (
        <>
            {errorMsg}
            <Formik
                validationSchema={LoginSchema}
                onSubmit={values => loginWithFirebase(values)}
                initialValues={{
                    email: '',
                    password: '',
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors,
                }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isValid={touched.email && !errors.email}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={values.password}
                                    onChange={handleChange}
                                    isValid={touched.password && !errors.password}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* checkbox à faire pour un remindMe */}
                            <Form.Group controlId="remindMe">
                                <FormCheck
                                    type="checkbox"
                                    value={values.remindMe}
                                    onChange={handleChange}
                                    isValid={touched.remindMe}
                                    label="Se souvenir de moi"
                                    custom />
                            </Form.Group>



                            <SendBtn />
                        </Form>
                    )}
            </Formik>
        </>
    )
}

export default LoginForm

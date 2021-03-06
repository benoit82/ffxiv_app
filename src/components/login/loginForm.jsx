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
import { EMAIL_ERR_MSG, FIELD_REQUIRED, PASSWORD_ERR_MSG, PASSWORD_MIN } from '../../utils/consts'

const LoginForm = () => {
    const firebase = useContext(FirebaseContext)
    const history = useHistory()
    const location = useLocation()
    const [errorMsg, setErrorMsg] = useState(null)
    const User = useContext(UserApi)

    const loginWithFirebase = async (values) => {
        setErrorMsg(null)
        try {
            const response = await firebase.signInUser(values.email, values.password)
            User.setUser(response)
            values.remindMe ? localStorage.setItem("uid", response.uid) : localStorage.removeItem("uid")
            if (location.state && location.state.from.pathname === "/admin"
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
            .email(EMAIL_ERR_MSG)
            .required(FIELD_REQUIRED)
        ,
        password: Yup.string()
            .min(PASSWORD_MIN, PASSWORD_ERR_MSG)
            .required(FIELD_REQUIRED)
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

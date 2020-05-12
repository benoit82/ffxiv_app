import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import { AuthApi } from "../../AppContext"
import Form from 'react-bootstrap/Form'
import { SendBtn } from "../formElements"
import Alert from 'react-bootstrap/Alert'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormCheck from 'react-bootstrap/FormCheck'

const LoginForm = () => {
    const Auth = useContext(AuthApi);
    const firebase = useContext(FirebaseContext);
    const [firebaseError, setfirebaseError] = useState({});
    const history = useHistory();

    const loginWithFirebase = async (values) => {
        try {
            setfirebaseError({})
            const response = await firebase.signInUser(values.email.trim(), values.password.trim());
            console.log('response :>> ', response);
            sessionStorage.setItem("user", JSON.stringify(response.user))
            if (values.remindMe) {
                localStorage.setItem("user", JSON.stringify(response.user))
            }
            Auth.setAuth(true);
            history.push("/");
        } catch (error) {
            setfirebaseError({ ...error, message: error.message });
        }
    }

    // gestion du formulaire avec Formik
    // gestion des erreurs
    const firebaseErrorMsg = firebaseError.message !== '' && <span>{firebaseError.message}</span>;

    // schema de validation
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("email invalide.")
            .required("champs obligatoire")
        ,
        password: Yup.string()
            .required("champs obligatoire")
        ,
        remindMe: Yup.boolean()
            .notRequired()
    });


    return (
        <>
            {firebaseErrorMsg}
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
            <Alert variant="info" className="mt-3">Nouvel utilisateur ? Aller à la page d'<Link to="/signup">inscription</Link> !</Alert>
        </>
    )
}

export default LoginForm

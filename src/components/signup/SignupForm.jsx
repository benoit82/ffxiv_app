import React, { useState, useRef, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import { Formik } from 'formik';
import * as Yup from 'yup'

const SignupForm = () => {
    const firebase = useContext(FirebaseContext);
    const [firebaseError, setfirebaseError] = useState({});
    const history = useHistory();

    const signupToFirebase = async (values) => {
        try {
            setfirebaseError({})
            await firebase.signUpUser(values.email.trim(), values.email.trim());
            history.push("/");
        } catch (error) {
            setfirebaseError({ ...error, message: error.message });
        }
    }
    // gestion du formulaire avec Formik
    // gestion des erreurs
    const firebaseErrorMsg = firebaseError.message !== '' && <span>{firebaseError.message}</span>;

    // schema de validation
    const minPseudoCaractere = 3;
    const maxPseudoCaractere = 15;
    const minPasswordCaractere = 6;
    const maxPasswordCaractere = 32;
    const signupSchema = Yup.object().shape({
        pseudo: Yup.string()
            .min(minPseudoCaractere, `Votre pseudo doit comporter entre ${minPseudoCaractere} et ${maxPseudoCaractere} lettres.`)
            .max(maxPseudoCaractere, `Votre pseudo doit comporter entre ${minPseudoCaractere} et ${maxPseudoCaractere} lettres.`)
            .required("champs obligatoire")
        ,
        email: Yup.string()
            .email("email invalide.")
            .required("champs obligatoire")
        ,
        password: Yup.string()
            .min(minPasswordCaractere, `Mot de passe trop petit (${minPasswordCaractere} caractères minimum).`)
            .max(maxPasswordCaractere, `Mot de passe trop grand (${maxPasswordCaractere} caractères maximum).`)
            .required("champs obligatoire")
        ,
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Mot de passe non conforme.')
            .required("champs obligatoire")
    });

    return (
        <>
            <h1>Inscription</h1>
            {firebaseErrorMsg}
            <Formik
                validationSchema={signupSchema}
                onSubmit={values => signupToFirebase(values)}
                initialValues={{
                    pseudo: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleReset,
                    values,
                    touched,
                    errors,
                }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="pseudo">
                                <Form.Label>Pseudo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Pseudo"
                                    value={values.pseudo}
                                    onChange={handleChange}
                                    isValid={touched.pseudo && !errors.pseudo}
                                    isInvalid={errors.pseudo}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.pseudo}
                                </Form.Control.Feedback>
                            </Form.Group>

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

                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirmation du mot de passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    isValid={touched.confirmPassword && !errors.confirmPassword}
                                    isInvalid={!!errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Envoyer
                            </Button>{' '}
                            <Button variant="secondary" type="reset" onClick={handleReset}>Réinitialiser</Button>
                        </Form>
                    )}
            </Formik>

            <Alert variant='warning' className="mt-3">Déjà inscrit ? Aller à la page de <Link to="/login">connexion</Link> !</Alert>
        </>
    )
}

export default SignupForm

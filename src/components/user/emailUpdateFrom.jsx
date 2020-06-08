import React, { useContext, useState } from 'react'
import { UserApi } from '../../utils/appContext'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import Form from 'react-bootstrap/Form'
import { FIELD_REQUIRED, EMAIL_ERR_MSG, PASSWORD_MIN, PASSWORD_ERR_MSG, EMAIL_UPDATE_ERR_MSG } from '../../utils/consts'
import { UpdateBtn } from '../formElements'
import Container from 'react-bootstrap/Container'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/msg'
import Col from 'react-bootstrap/Col'

const EmailUpdateFrom = () => {
    const User = useContext(UserApi)
    const firebase = useContext(FirebaseContext)
    const [msg, setMsg] = useState("")
    const { user, setUser } = User
    const { email } = user

    const initUpdateEmail = { newEmail: "", password: "" }
    const emailUpdateSchema = Yup.object().shape({
        newEmail: Yup.string()
            .email(EMAIL_ERR_MSG)
            .notOneOf([email, null], EMAIL_UPDATE_ERR_MSG)
            .required(FIELD_REQUIRED)
        ,
        password: Yup.string()
            .min(PASSWORD_MIN, PASSWORD_ERR_MSG)
            .required(FIELD_REQUIRED)
        ,
    })

    const updateUserEmail = async (values, { resetForm }) => {
        try {
            const userCredential = await firebase.auth.signInWithEmailAndPassword(
                email,
                values.password
            )
            userCredential.user.updateEmail(values.newEmail);
            firebase.updateUser(user, { email: values.newEmail });
            setUser(firebase.getUser(user.uid))
        } catch (error) {
            setMsg(<Msg error={error.message} />)
        }
    }

    return (
        <Container>
            <h2>Mettre à jour son email</h2>
            {msg}
            <Formik
                validationSchema={emailUpdateSchema}
                initialValues={initUpdateEmail}
                onSubmit={updateUserEmail}
            >
                {
                    ({ handleSubmit, handleChange, values, errors, touched }) => (
                        <Col lg={4}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="newEmail">
                                    <Form.Label>Mon nouvel email</Form.Label>
                                    <Field
                                        as={Form.Control}
                                        type="email"
                                        name="newEmail"
                                        value={values.newEmail}
                                        onChange={handleChange}
                                        isValid={touched.newEmail && !errors.newEmail}
                                        isInvalid={errors.newEmail}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.newEmail}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Field
                                        as={Form.Control}
                                        type="password"
                                        name="password"
                                        isValid={touched.password && !errors.password}
                                        isInvalid={!!errors.password}
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <UpdateBtn />
                                </Form.Group>
                            </Form>
                        </Col>
                    )
                }
            </Formik>
        </Container>
    )
}

export default EmailUpdateFrom

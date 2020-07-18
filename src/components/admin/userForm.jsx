import React, { useContext } from 'react'
import { Formik, Field } from 'formik'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import * as Yup from 'yup'
import { UpdateBtn } from '../formElements'
import Col from 'react-bootstrap/Col'
import { FirebaseContext } from '../firebase'
import { FIELD_REQUIRED, EMAIL_ERR_MSG, PSEUDO_MIN, PSEUDO_MAX, PSEUDO_ERR_MSG } from '../../utils/consts'
import FormCheck from 'react-bootstrap/FormCheck'

const UserForm = ({ user }) => {
    const firebase = useContext(FirebaseContext)

    const { pseudo, email, isAdmin, isCrafter, isGatherer } = user

    const userSchema = Yup.object().shape({
        pseudo: Yup.string()
            .min(PSEUDO_MIN, PSEUDO_ERR_MSG)
            .max(PSEUDO_MAX, PSEUDO_ERR_MSG)
            .required(FIELD_REQUIRED)
        ,
        email: Yup.string()
            .email(EMAIL_ERR_MSG)
            .required(FIELD_REQUIRED)
        ,

    })

    const updateUser = (values) => {
        firebase.updateUser(user, values)
    }


    return (
        <Container>
            <Formik
                validationSchema={userSchema}
                onSubmit={values => updateUser(values)}
                initialValues={{
                    pseudo,
                    email,
                    isAdmin,
                    isCrafter,
                    isGatherer
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors,
                }) => (
                        <Col lg={4}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="pseudo">
                                    <Form.Label>Pseudo</Form.Label>
                                    <Field
                                        as={Form.Control}
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
                                    <Field
                                        as={Form.Control}
                                        type="email"
                                        placeholder="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        isValid={touched.email && !errors.email}
                                        isInvalid={errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="isAdmin">
                                    <FormCheck
                                        type="checkbox"
                                        checked={values.isAdmin}
                                        value={values.isAdmin}
                                        onChange={handleChange}
                                        label="Admin"
                                        custom
                                    />
                                </Form.Group>
                                <Form.Group controlId="isCrafter">
                                    <FormCheck
                                        type="checkbox"
                                        checked={values.isCrafter}
                                        value={values.isCrafter}
                                        onChange={handleChange}
                                        label="Crafteur"
                                        custom
                                    />
                                </Form.Group>
                                <Form.Group controlId="isGatherer">
                                    <FormCheck
                                        type="checkbox"
                                        checked={values.isGatherer}
                                        value={values.isGatherer}
                                        onChange={handleChange}
                                        label="Récolteur"
                                        custom
                                    />
                                </Form.Group>
                                <UpdateBtn />
                            </Form>
                        </Col>
                    )
                }
            </Formik>
        </Container>
    )
}

export default UserForm

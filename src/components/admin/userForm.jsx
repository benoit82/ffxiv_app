import React, { useContext } from 'react'
import { Formik, Field } from 'formik'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import * as Yup from 'yup'
import { UpdateBtn } from '../formElements'
import Col from 'react-bootstrap/Col'
import { FirebaseContext } from '../firebase'

const UserForm = ({ user }) => {
    const firebase = useContext(FirebaseContext)

    const { pseudo, email, isAdmin, isCrafter, isGatherer } = user

    const minPseudoCaractere = 3
    const maxPseudoCaractere = 15
    const userSchema = Yup.object().shape({
        pseudo: Yup.string()
            .min(minPseudoCaractere, `Votre pseudo doit comporter entre ${minPseudoCaractere} et ${maxPseudoCaractere} lettres.`)
            .max(maxPseudoCaractere, `Votre pseudo doit comporter entre ${minPseudoCaractere} et ${maxPseudoCaractere} lettres.`)
            .required("champs obligatoire")
        ,
        email: Yup.string()
            .email("email invalide.")
            .required("champs obligatoire")
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
                                    <Form.Label>Admin</Form.Label>
                                    <Field
                                        custom
                                        as={Form.Control}
                                        type="checkbox"
                                        checked={values.isAdmin}
                                        value={values.isAdmin}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="isCrafter">
                                    <Form.Label>Crafteur</Form.Label>
                                    <Field
                                        custom
                                        as={Form.Control}
                                        type="checkbox"
                                        checked={values.isCrafter}
                                        value={values.isCrafter}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="isGatherer">
                                    <Form.Label>Récolteur</Form.Label>
                                    <Field
                                        custom
                                        as={Form.Control}
                                        type="checkbox"
                                        checked={values.isGatherer}
                                        value={values.isGatherer}
                                        onChange={handleChange}
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

import React, { useContext } from 'react'
import { UserApi } from '../../utils/appContext'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Form from 'react-bootstrap/Form'
import { FIELD_REQUIRED, EMAIL_ERR_MSG, PASSWORD_MIN, PASSWORD_ERR_MSG, EMAIL_UPDATE_ERR_MSG } from '../../utils/consts'
import { UpdateBtn } from '../formElements'
import { FirebaseContext } from '../firebase'
import { showInfoMessage } from '../../utils/globalFunctions'

const EmailUpdateForm = () => {
    const User = useContext(UserApi)
    const firebase = useContext(FirebaseContext)
    const { user, setUser } = User
    const { email } = user

    const formik = useFormik({
        initialValues: {
            newEmail: "",
            password: ""
        },
        validationSchema: Yup.object().shape({
            newEmail: Yup.string()
                .email(EMAIL_ERR_MSG)
                .notOneOf([email, null], EMAIL_UPDATE_ERR_MSG)
                .required(FIELD_REQUIRED)
            ,
            password: Yup.string()
                .min(PASSWORD_MIN, PASSWORD_ERR_MSG)
                .required(FIELD_REQUIRED)
            ,
        }),
        onSubmit: async (values) => {
            try {
                const userCredential = await firebase.auth.signInWithEmailAndPassword(
                    email,
                    values.password
                )
                userCredential.user.updateEmail(values.newEmail);
                firebase.updateUser(user, { email: values.newEmail });
                setUser(firebase.getUser(user.uid))
            } catch (error) {
                showInfoMessage("error", error.message)
            }
        }
    })



    return (
        <Form onSubmit={formik.handleSubmit}>
            <h2>Mettre à jour son email</h2>
            <Form.Group controlId="newEmail">
                <Form.Label>Mon nouvel email</Form.Label>
                <Form.Control
                    type="email"
                    name="newEmail"
                    value={formik.values.newEmail}
                    onChange={formik.handleChange}
                    isInvalid={formik.errors.newEmail && formik.validateOnChange}
                />
                <Form.Control.Feedback type="invalid">
                    {formik.errors.newEmail}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    isInvalid={formik.errors.password && formik.validateOnChange}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                </Form.Control.Feedback>
            </Form.Group>
            <UpdateBtn />
            {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
        </Form>
    )
}

export default EmailUpdateForm
